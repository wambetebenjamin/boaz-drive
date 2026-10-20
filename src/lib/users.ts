import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
type StoredUser = { email: string; name: string; salt: string; hash: string; idNumber: string; phone: string };
function kvConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

export async function saveUser(user: Omit<StoredUser, 'salt' | 'hash'>, password: string) {
  const kv = kvConfig();
  if (!kv) throw new Error('Account storage is not configured');
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64) as Buffer;
  const record: StoredUser = { ...user, email: user.email.toLowerCase(), salt, hash: derived.toString('hex') };
  const response = await fetch(`${kv.url}/set/${encodeURIComponent(`boaz:user:${record.email}`)}`, { method: 'POST', headers: { Authorization: `Bearer ${kv.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(record), cache: 'no-store' });
  if (!response.ok) throw new Error('Could not create the account');
}

export async function verifyUser(email: string, password: string) {
  const kv = kvConfig();
  if (!kv) return null;
  const response = await fetch(`${kv.url}/get/${encodeURIComponent(`boaz:user:${email.toLowerCase()}`)}`, { headers: { Authorization: `Bearer ${kv.token}` }, cache: 'no-store' });
  if (!response.ok) return null;
  const result = await response.json() as { result?: string | StoredUser | null };
  const stored = typeof result.result === 'string' ? JSON.parse(result.result) as StoredUser : result.result;
  if (!stored?.salt || !stored.hash) return null;
  const actual = await scrypt(password, stored.salt, 64) as Buffer;
  const expected = Buffer.from(stored.hash, 'hex');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  return { id: stored.email, email: stored.email, name: stored.name };
}

export async function kvSet(key: string, value: unknown) {
  const kv = kvConfig();
  if (!kv) return false;
  const response = await fetch(`${kv.url}/set/${encodeURIComponent(key)}`, { method: 'POST', headers: { Authorization: `Bearer ${kv.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(value), cache: 'no-store' });
  return response.ok;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const kv = kvConfig();
  if (!kv) return null;
  const response = await fetch(`${kv.url}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${kv.token}` }, cache: 'no-store' });
  if (!response.ok) return null;
  const result = await response.json() as { result?: T | string | null };
  if (typeof result.result === 'string') { try { return JSON.parse(result.result) as T; } catch { return null; } }
  return (result.result as T | null) ?? null;
}
