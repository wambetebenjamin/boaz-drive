import { NextResponse } from 'next/server';
import { getCar } from '@/lib/fleet';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
  return NextResponse.json({ car });
}
