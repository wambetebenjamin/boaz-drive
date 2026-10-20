import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { verifyRecaptcha } from '@/lib/recaptcha';

const schema = z.object({ name: z.string().min(2).max(100), email: z.string().email(), phone: z.string().min(8).max(20).optional(), message: z.string().min(10).max(3000), recaptchaToken: z.string().min(1), recaptchaVersion: z.enum(['v3', 'v2']).optional() });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please check the contact details.', details: parsed.error.flatten() }, { status: 400 });
  const challenge = await verifyRecaptcha(parsed.data.recaptchaToken, 'contact', parsed.data.recaptchaVersion ?? 'v3');
  if (!challenge.success) return NextResponse.json({ error: 'Security check could not be completed.', challengeRequired: challenge.score < 0.5 }, { status: challenge.reason === 'missing-configuration-or-token' ? 503 : 403 });
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) return NextResponse.json({ error: 'Contact email is not configured yet. Please reach us on WhatsApp.' }, { status: 503 });
  const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: Number(SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  try {
    await transporter.sendMail({ from: SMTP_FROM, to: SMTP_FROM, replyTo: parsed.data.email, subject: `Boaz Drive enquiry from ${parsed.data.name}`, text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone || 'Not provided'}\n\n${parsed.data.message}` });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'We could not send your message. Please try WhatsApp instead.' }, { status: 502 });
  }
}
