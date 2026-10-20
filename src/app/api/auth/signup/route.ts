import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { kvGet, saveUser } from '@/lib/users';

const schema = z.object({ name: z.string().min(2).max(100), email: z.string().email(), password: z.string().min(10).max(128), idNumber: z.string().min(4).max(32), phone: z.string().min(9).max(20), recaptchaToken: z.string().min(1), recaptchaVersion: z.enum(['v3', 'v2']).optional() });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please check your details.', details: parsed.error.flatten() }, { status: 400 });
  const challenge = await verifyRecaptcha(parsed.data.recaptchaToken, 'signup', parsed.data.recaptchaVersion ?? 'v3');
  if (!challenge.success) return NextResponse.json({ error: 'Security check could not be completed.', challengeRequired: challenge.score < 0.5 }, { status: challenge.reason === 'missing-configuration-or-token' ? 503 : 403 });
  const { name, email, password, idNumber, phone } = parsed.data;
  if (await kvGet(`boaz:user:${email.toLowerCase()}`)) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  try {
    await saveUser({ name, email, idNumber, phone }, password);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Account storage is not configured. Please contact Boaz Drive.' }, { status: 503 });
  }
}
