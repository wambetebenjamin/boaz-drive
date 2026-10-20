import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { MyBookingsList } from '@/components/MyBookingsList';

export const metadata: Metadata = { title: 'My bookings' };
export const dynamic = 'force-dynamic';
export default async function MyBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin?callbackUrl=%2Fmy-bookings');
  return <><section className="page-hero"><div className="page-width"><div className="breadcrumbs"><a href="/">Home</a><span>/</span><span>My bookings</span></div><span className="eyebrow">Welcome back{session.user.name ? `, ${session.user.name}` : ''}</span><h1>Your journeys,<br />all in one place.</h1><p>Check upcoming trips, review previous rentals, or talk to us about changing a booking.</p></div></section><section className="page-content"><div className="page-width"><MyBookingsList /></div></section></>;
}
