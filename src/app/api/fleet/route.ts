import { NextRequest, NextResponse } from 'next/server';
import { cars } from '@/lib/fleet';

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get('category');
  const seats = Number(params.get('seats') || 0);
  const minPrice = Number(params.get('minPrice') || 0);
  const maxPrice = Number(params.get('maxPrice') || Infinity);
  const transmission = params.get('transmission');
  const filtered = cars.filter((car) => (!category || car.category.toLowerCase() === category.toLowerCase()) && (!seats || car.seats >= seats) && (!transmission || car.transmission.toLowerCase() === transmission.toLowerCase()) && car.price >= minPrice && car.price <= maxPrice);
  return NextResponse.json({ cars: filtered, count: filtered.length });
}
