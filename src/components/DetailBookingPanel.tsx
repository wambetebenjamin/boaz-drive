'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, TriangleAlert } from 'lucide-react';
import type { Car } from '@/lib/fleet';
import { formatKes } from '@/lib/fleet';

type Availability = { available: boolean; unavailableRanges?: { startDate: string; endDate: string }[] };

export function DetailBookingPanel({ car }: { car: Car }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickUp, setPickUp] = useState<'collect' | 'delivery'>('collect');
  const [address, setAddress] = useState('');
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const totalNode = useRef<HTMLSpanElement>(null);
  const days = useMemo(() => {
    if (!startDate || !endDate) return 1;
    return Math.max(1, Math.ceil((new Date(`${endDate}T00:00:00`).getTime() - new Date(`${startDate}T00:00:00`).getTime()) / 86400000));
  }, [startDate, endDate]);
  const total = days * car.price;

  useEffect(() => {
    let alive = true;
    const animate = async () => {
      const { gsap } = await import('gsap');
      if (!alive || !totalNode.current) return;
      const meter = { value: Number(totalNode.current.dataset.value || total) };
      gsap.to(meter, { value: total, duration: .45, ease: 'power2.out', onUpdate: () => {
        if (totalNode.current) { totalNode.current.textContent = formatKes(Math.round(meter.value)); totalNode.current.dataset.value = String(meter.value); }
      } });
    };
    void animate();
    return () => { alive = false; };
  }, [total]);

  useEffect(() => {
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) { setAvailability(null); return; }
    let alive = true;
    setChecking(true);
    fetch('/api/fleet/availability', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ carId: car.id, startDate, endDate }) })
      .then((response) => response.json()).then((value: Availability) => { if (alive) setAvailability(value); })
      .catch(() => { if (alive) setAvailability({ available: true }); })
      .finally(() => { if (alive) setChecking(false); });
    return () => { alive = false; };
  }, [car.id, endDate, startDate]);

  const proceed = () => {
    setError('');
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) { setError('Choose a pickup date and a later return date.'); return; }
    if (pickUp === 'delivery' && address.trim().length < 5) { setError('Enter a delivery address to continue.'); return; }
    if (availability && !availability.available) { setError('Those dates are not available. Please choose another range.'); return; }
    sessionStorage.setItem('boaz_drive_checkout', JSON.stringify({ carId: car.id, startDate, endDate, pickUp, address, days, total }));
    router.push(`/checkout?car=${car.slug}`);
  };

  return <motion.aside className="booking-panel" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
    <div className="booking-price"><strong>{formatKes(car.price)}</strong><span>per day</span></div>
    <h2>Your trip details</h2><p>Choose dates and how you would like to get your car.</p>
    <div className="form-field"><label htmlFor="pickup-date">Pickup date</label><input id="pickup-date" className={startDate ? 'date-range-highlight' : ''} type="date" min={today} value={startDate} onChange={(event) => { setStartDate(event.target.value); setEndDate(''); }} /></div>
    <div className="form-field"><label htmlFor="return-date">Return date</label><input id="return-date" className={endDate ? 'date-range-highlight' : ''} type="date" min={startDate || today} value={endDate} onChange={(event) => setEndDate(event.target.value)} /></div>
    <div className="delivery-options"><label className="delivery-choice"><input type="radio" name="pickup" checked={pickUp === 'collect'} onChange={() => setPickUp('collect')} /><strong>Self collect</strong><small>From our Nairobi location</small></label><label className="delivery-choice"><input type="radio" name="pickup" checked={pickUp === 'delivery'} onChange={() => setPickUp('delivery')} /><strong>Deliver to me</strong><small>Free across Nairobi</small></label></div>
    {pickUp === 'delivery' && <div className="form-field"><label htmlFor="delivery-address">Delivery address</label><input id="delivery-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street, neighbourhood, Nairobi" /></div>}
    {startDate && endDate && <div className="availability-note">{checking ? <><CalendarDays size={15} /> Checking those dates</> : availability?.available ? <><CheckCircle2 size={15} /> Dates look available</> : <><TriangleAlert size={15} /> This car is unavailable for those dates</>}</div>}
    <div className="booking-total"><span>Estimated total, {days} {days === 1 ? 'day' : 'days'}</span><strong ref={totalNode} data-value={total}>{formatKes(total)}</strong></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-primary" onClick={proceed}>Book Now <ArrowRight size={16} /></button>
    <p className="booking-footnote"><MapPin size={12} /> Free delivery in Nairobi. No booking fee.</p>
  </motion.aside>;
}
