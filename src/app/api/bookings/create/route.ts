import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { bookingSchema } from '@/lib/bookings';
import { cars } from '@/lib/fleet';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { kvGet, kvSet } from '@/lib/users';

export async function POST(request: Request) {
  const parsed = bookingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please check the booking details.', details: parsed.error.flatten() }, { status: 400 });
  const challenge = await verifyRecaptcha(parsed.data.recaptchaToken, 'booking', parsed.data.recaptchaVersion ?? 'v3');
  if (!challenge.success) return NextResponse.json({ error: 'Security check could not be completed.', challengeRequired: challenge.score < 0.5, score: challenge.score }, { status: challenge.reason === 'missing-configuration-or-token' ? 503 : 403 });
  const car = cars.find((item) => item.id === parsed.data.carId);
  if (!car) return NextResponse.json({ error: 'Vehicle not found.' }, { status: 404 });
  const start = new Date(`${parsed.data.startDate}T00:00:00`);
  const end = new Date(`${parsed.data.endDate}T00:00:00`);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
  const reference = `BD-${randomBytes(4).toString('hex').toUpperCase()}`;
  const booking = {
    reference, carId: car.id, carSlug: car.slug, carName: `${car.make} ${car.model}`,
    category: car.category, image: car.image, startDate: parsed.data.startDate,
    endDate: parsed.data.endDate, days, total: days * car.price,
    pickUp: parsed.data.pickUp, address: parsed.data.address, fullName: parsed.data.fullName,
    email: parsed.data.email, phone: parsed.data.phone, payment: parsed.data.payment,
    status: 'Pending payment', createdAt: new Date().toISOString(),
  };
  await kvSet(`boaz:booking:${reference}`, booking);
  const userKey = `boaz:bookings:${parsed.data.email.toLowerCase()}`;
  const references = await kvGet<string[]>(userKey) ?? [];
  await kvSet(userKey, [...references, reference]);
  return NextResponse.json({ booking }, { status: 201 });
}
