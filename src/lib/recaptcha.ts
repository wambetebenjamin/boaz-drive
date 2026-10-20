export async function verifyRecaptcha(token: string, action: string, version: 'v3' | 'v2' = 'v3') {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !token) return { success: false, score: 0, action, reason: 'missing-configuration-or-token' };
  try {
    const body = new URLSearchParams({ secret, response: token });
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body, cache: 'no-store' });
    if (!response.ok) return { success: false, score: 0, action, reason: 'verification-unavailable' };
    const result = await response.json() as { success?: boolean; score?: number; action?: string };
    const score = result.score ?? 0;
    const valid = version === 'v2'
      ? Boolean(result.success) && result.score === undefined
      : Boolean(result.success) && score >= 0.5 && result.action === action;
    return { success: valid, score: version === 'v2' && valid ? 1 : score, action: result.action ?? action, reason: valid ? undefined : 'challenge-required' };
  } catch {
    return { success: false, score: 0, action, reason: 'verification-unavailable' };
  }
}
