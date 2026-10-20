import type { Metadata } from 'next';
import { BookingReceipt } from '@/components/BookingReceipt';
import { cars } from '@/lib/fleet';

export const metadata: Metadata = { title: 'Booking confirmation' };
export default async function BookingConfirmation({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref = 'BD-PENDING' } = await searchParams;
  return <><section className="page-hero"><div className="page-width"><div className="breadcrumbs"><a href="/">Home</a><span>/</span><span>Booking confirmation</span></div><span className="eyebrow">We have your details</span><h1>Thank you for booking.</h1><p>We will be in touch shortly to confirm the next steps.</p></div></section><BookingReceipt cars={cars} reference={ref} /></>;
}
