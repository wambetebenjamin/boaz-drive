'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, CircleCheck, Clock, MessageCircle, X } from 'lucide-react';
import { formatKes } from '@/lib/fleet';

type Rental = { reference: string; carName: string; image: string; startDate: string; endDate: string; total: number; status: string; pickUp: string };
export function MyBookingsList() {
  const [bookings, setBookings] = useState<Rental[]>([]);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selected, setSelected] = useState<Rental | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const refresh = async () => {
    setLoading(true);
    try { const response = await fetch('/api/bookings/mine', { cache: 'no-store' }); const data = await response.json() as { bookings?: Rental[]; error?: string }; if (!response.ok) throw new Error(data.error || 'Bookings could not be loaded.'); setBookings(data.bookings ?? []); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Bookings could not be loaded.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const upcoming = bookings.filter((item) => new Date(item.startDate).getTime() >= Date.now() && item.status !== 'Cancelled');
  const past = bookings.filter((item) => new Date(item.startDate).getTime() < Date.now() || item.status === 'Cancelled');
  const visible = tab === 'upcoming' ? upcoming : past;
  const cancel = async (reference: string) => {
    setBusy(reference); setError('');
    try { const response = await fetch(`/api/bookings/${reference}`, { method: 'DELETE' }); const result = await response.json() as { error?: string }; if (!response.ok) throw new Error(result.error || 'Could not cancel this booking.'); await refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not cancel this booking.'); }
    finally { setBusy(''); }
  };
  return <><div className="bookings-tabs"><button className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>Upcoming <span>{upcoming.length}</span></button><button className={tab === 'past' ? 'active' : ''} onClick={() => setTab('past')}>Past rentals <span>{past.length}</span></button></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {loading ? <div className="notice">Loading your rentals...</div> : visible.length ? <div className="bookings-list">{visible.map((booking) => <article className="rental-card" key={booking.reference}><div className="rental-photo"><Image src={booking.image} alt={booking.carName} fill sizes="220px" /></div><div className="rental-info"><span className="eyebrow">{booking.reference} · {booking.status}</span><h2>{booking.carName}</h2><p><CalendarDays size={14} /> {booking.startDate} to {booking.endDate}</p><p><CircleCheck size={14} /> {booking.pickUp === 'delivery' ? 'Delivery' : 'Self collect'} · {formatKes(booking.total)}</p></div><div className="rental-actions"><button className="button button-quiet" onClick={() => setSelected(booking)}>View details</button>{tab === 'upcoming' && <><a className="button button-quiet" href={`https://wa.me/254112272061?text=${encodeURIComponent(`Hello Boaz Drive, I would like to extend booking ${booking.reference}.` )}`} target="_blank" rel="noreferrer"><MessageCircle size={14} /> Extend rental</a><button className="cancel-booking" disabled={busy === booking.reference} onClick={() => cancel(booking.reference)}>{busy === booking.reference ? 'Cancelling...' : 'Cancel booking'}</button></>}</div></article>)}</div> : <div className="empty-state"><span className="empty-icon"><Clock size={23} /></span><h2>No {tab} rentals yet</h2><p>When you book a car, your trip details will live here.</p><Link className="button button-primary" href="/fleet">Browse the fleet <ArrowRight size={15} /></Link></div>}
    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="consent-modal booking-detail-modal" role="dialog" aria-modal="true" aria-labelledby="booking-detail-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={() => setSelected(null)}><X size={17} /></button><span className="eyebrow">{selected.reference}</span><h2 id="booking-detail-title">{selected.carName}</h2><div className="summary-row"><span>Pickup date</span><strong>{selected.startDate}</strong></div><div className="summary-row"><span>Return date</span><strong>{selected.endDate}</strong></div><div className="summary-row"><span>Status</span><strong>{selected.status}</strong></div><div className="summary-row"><span>Total</span><strong>{formatKes(selected.total)}</strong></div><Link className="button button-primary full-width" href={`/booking-confirmation?ref=${selected.reference}`}>Open receipt <ArrowRight size={15} /></Link></section></div>}
  </>;
}
