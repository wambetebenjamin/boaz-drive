import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyRecaptcha } from '@/lib/recaptcha';

const schema = z.object({ token: z.string().min(1), action: z.string().min(1).max(40), version: z.enum(['v3', 'v2']).optional() });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, score: 0, error: 'A valid challenge token is required.' }, { status: 400 });
  const result = await verifyRecaptcha(parsed.data.token, parsed.data.action, parsed.data.version ?? 'v3');
  if (result.reason === 'missing-configuration-or-token') return NextResponse.json({ ...result, error: 'reCAPTCHA is not configured on this site.' }, { status: 503 });
  return NextResponse.json({ ...result, challengeRequired: result.score < 0.5 }, { status: result.success ? 200 : 403 });
}
