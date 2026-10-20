import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { kvGet } from '@/lib/users';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Sign in to view bookings.' }, { status: 401 });
  const refs = await kvGet<string[]>(`boaz:bookings:${session.user.email.toLowerCase()}`) ?? [];
  const results = await Promise.all(refs.map((reference) => kvGet<Record<string, unknown>>(`boaz:booking:${reference}`)));
  return NextResponse.json({ bookings: results.filter(Boolean) });
}
