'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Download, MessageCircle } from 'lucide-react';
import type { Car } from '@/lib/fleet';
import { formatKes } from '@/lib/fleet';

type Booking = { reference: string; carId: string; carName: string; image: string; startDate: string; endDate: string; days: number; total: number; pickUp: string; payment: string; status: string };
export function BookingReceipt({ cars, reference }: { cars: Car[]; reference: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [qr, setQr] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);
  const car = cars.find((item) => item.id === booking?.carId) ?? cars[0];
  useEffect(() => {
    let alive = true;
    const saved = sessionStorage.getItem('boaz_drive_confirmation');
    if (saved) { try { const data = JSON.parse(saved) as Booking; if (alive) setBooking(data); } catch { /* ignore malformed local state */ } }
    import('qrcode').then((QRCode) => QRCode.default.toDataURL(reference, { width: 180, margin: 1, color: { dark: '#183b2a', light: '#ffffff' } })).then((value) => { if (alive) setQr(value); }).catch(() => undefined);
    return () => { alive = false; };
  }, [reference]);

  const downloadPdf = async () => {
    if (!receiptRef.current) return;
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
    const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = 190;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 12, width, Math.min(height, 270));
    pdf.save(`boaz-drive-${booking?.reference || reference}.pdf`);
  };
  const shareUrl = `https://wa.me/254112272061?text=${encodeURIComponent(`Hello Boaz Drive, I would like to confirm booking ${booking?.reference || reference}.`)}`;

  if (!booking) return <section className="error-page"><div><span className="eyebrow">Booking reference: {reference}</span><h1>We could not find this receipt.</h1><p>Try opening this page again from your booking, or browse the fleet to start a new one.</p><Link className="button button-primary" href="/fleet">Back to the fleet <ArrowRight size={15} /></Link></div></section>;

  return <div className="receipt-shell"><motion.div className="receipt-card" ref={receiptRef} initial={{ opacity: 0, scale: .94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }}>
    <div className="receipt-top"><div><span className="success-icon"><Check size={24} /></span><span className="eyebrow">Booking received</span><h1 className="receipt-heading">Your road trip is taking shape.</h1><p className="receipt-status">We have your request. Our team will get in touch to confirm payment and pickup details.</p></div><div className="receipt-ref">Booking reference<strong>{booking.reference}</strong></div></div>
    <div className="receipt-car"><div className="receipt-car-image"><Image src={booking.image || car.image} alt={booking.carName} fill sizes="200px" /></div><div><span className="eyebrow">Your selected vehicle</span><h2>{booking.carName}</h2><p>{booking.days} {booking.days === 1 ? 'day' : 'days'} of driving freedom</p></div></div>
    <div className="receipt-data"><div><small>Pickup date</small><strong>{booking.startDate}</strong></div><div><small>Return date</small><strong>{booking.endDate}</strong></div><div><small>Collection</small><strong>{booking.pickUp === 'delivery' ? 'Nairobi delivery' : 'Self collect'}</strong></div></div>
    <div className="receipt-total"><span>Booking total</span><strong>{formatKes(booking.total)}</strong></div>
    <div className="receipt-qr">{qr && <img src={qr} alt={`QR code for booking ${booking.reference}`} />}<p>Keep this reference handy. Scan the code or share the booking reference when you speak with our team.<br /><b>Payment is confirmed separately with Boaz Drive.</b></p></div>
  </motion.div><div className="receipt-actions"><button className="button button-primary" onClick={downloadPdf}><Download size={15} /> Download PDF receipt</button><a className="button button-dark" href={shareUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Share on WhatsApp</a><Link className="button button-quiet" href="/fleet">Browse more cars</Link></div></div>;
}
