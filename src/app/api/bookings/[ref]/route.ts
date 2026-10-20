import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { kvGet, kvSet } from '@/lib/users';

type Booking = { reference: string; email: string; startDate: string; status: string; [key: string]: unknown };
export async function GET(_request: Request, { params }: { params: Promise<{ ref: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Sign in to view this booking.' }, { status: 401 });
  const { ref } = await params;
  const booking = await kvGet<Booking>(`boaz:booking:${ref}`);
  if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  if (booking.email.toLowerCase() !== session.user.email.toLowerCase()) return NextResponse.json({ error: 'This booking belongs to another account.' }, { status: 403 });
  return NextResponse.json({ booking });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ ref: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Sign in to cancel this booking.' }, { status: 401 });
  const { ref } = await params;
  const booking = await kvGet<Booking>(`boaz:booking:${ref}`);
  if (!booking || booking.email.toLowerCase() !== session.user.email.toLowerCase()) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  if (new Date(booking.startDate).getTime() - Date.now() <= 24 * 60 * 60 * 1000) return NextResponse.json({ error: 'Bookings can only be cancelled more than 24 hours before pickup.' }, { status: 409 });
  const cancelled = { ...booking, status: 'Cancelled', cancelledAt: new Date().toISOString() };
  await kvSet(`boaz:booking:${ref}`, cancelled);
  return NextResponse.json({ booking: cancelled });
}
