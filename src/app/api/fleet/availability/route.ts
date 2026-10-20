import { NextResponse } from 'next/server';
import { z } from 'zod';
import { cars } from '@/lib/fleet';

const schema = z.object({ carId: z.string().min(1), startDate: z.string().date(), endDate: z.string().date() }).refine((value) => value.endDate > value.startDate, { message: 'Return date must be after pickup' });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid date range', details: parsed.error.flatten() }, { status: 400 });
  if (!cars.some((car) => car.id === parsed.data.carId)) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
  return NextResponse.json({ available: true, unavailableRanges: [] });
}
