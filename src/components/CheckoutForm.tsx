'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, CreditCard, LockKeyhole, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Car } from '@/lib/fleet';
import { bookingSchema } from '@/lib/bookings';
import { formatKes } from '@/lib/fleet';
import { RecaptchaChallenge } from '@/components/RecaptchaChallenge';

type FormFields = { fullName: string; idNumber: string; phone: string; email: string; licenceNumber: string; payment: 'mpesa' | 'card' };
type Trip = { carId: string; startDate: string; endDate: string; pickUp: 'collect' | 'delivery'; address: string; days: number; total: number };
type Props = { cars: Car[]; siteKey?: string; v2SiteKey?: string };
const formFields = z.object({ fullName: z.string().min(2, 'Enter your full name'), idNumber: z.string().min(4, 'Enter a valid ID number'), phone: z.string().min(9, 'Enter a valid phone number'), email: z.string().email('Enter a valid email address'), licenceNumber: z.string().min(4, 'Enter a valid licence number'), payment: z.enum(['mpesa', 'card']) });

function getCaptchaToken(siteKey: string, action: string) {
  return new Promise<string>((resolve, reject) => {
    if (!window.grecaptcha || !siteKey) return reject(new Error('reCAPTCHA is not configured. Please contact Boaz Drive on WhatsApp to finish this booking.'));
    window.grecaptcha.ready(() => window.grecaptcha!.execute(siteKey, { action }).then(resolve, reject));
  });
}

export function CheckoutForm({ cars, siteKey, v2SiteKey }: Props) {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState('');
  const [challengeRequired, setChallengeRequired] = useState(false);
  const [captchaV2Token, setCaptchaV2Token] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({ defaultValues: { payment: 'mpesa' } });
  useEffect(() => {
    try { const saved = sessionStorage.getItem('boaz_drive_checkout'); if (saved) setTrip(JSON.parse(saved) as Trip); } catch { setTrip(null); }
  }, []);
  const car = cars.find((item) => item.id === trip?.carId) ?? cars[0];

  const submit = handleSubmit(async (values) => {
    setError(''); setChallengeRequired(false);
    if (!trip) { setError('Your trip dates are missing. Go back to the fleet and choose a car.'); return; }
    const fields = formFields.safeParse(values);
    if (!fields.success) { setError(fields.error.issues[0]?.message || 'Please check your details.'); return; }
    setSubmitting(true);
    try {
      const recaptchaToken = captchaV2Token || await getCaptchaToken(siteKey || '', 'booking');
      const payload = { ...fields.data, ...trip, recaptchaToken, recaptchaVersion: captchaV2Token ? 'v2' : 'v3' };
      const validated = bookingSchema.safeParse(payload);
      if (!validated.success) { setError(validated.error.issues[0]?.message || 'Please check your booking details.'); setSubmitting(false); return; }
      const response = await fetch('/api/bookings/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validated.data) });
      const result = await response.json() as { booking?: { reference: string; [key: string]: unknown }; error?: string; challengeRequired?: boolean };
      if (!response.ok || !result.booking) { setError(result.error || 'We could not create the booking. Please try again.'); setChallengeRequired(Boolean(result.challengeRequired)); setSubmitting(false); return; }
      sessionStorage.setItem('boaz_drive_confirmation', JSON.stringify(result.booking));
      router.push(`/booking-confirmation?ref=${encodeURIComponent(result.booking.reference)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Please try again or contact us on WhatsApp.');
      setSubmitting(false);
    }
  });

  const field = (name: keyof FormFields, label: string, placeholder: string, type = 'text') => <div className="form-field" key={name}><label htmlFor={name}>{label}</label><input id={name} type={type} placeholder={placeholder} {...register(name)} aria-invalid={Boolean(errors[name])} />{errors[name] && <small role="alert">{errors[name]?.message}</small>}</div>;

  return <div className="form-layout"><form className="form-card" onSubmit={submit} noValidate><span className="eyebrow">A few quick details</span><h2>Tell us who is driving.</h2><p className="form-intro">Your information is used to prepare your rental. Fields marked below are required.</p>
    <div className="form-grid">{field('fullName', 'Full name', 'As shown on your ID')}{field('idNumber', 'National ID or passport', 'ID or passport number')}{field('phone', 'Phone number', '+254 7XX XXX XXX', 'tel')}{field('email', 'Email address', 'you@example.com', 'email')}{field('licenceNumber', 'Driving licence number', 'Licence number')}</div>
    {trip?.pickUp === 'delivery' && <div className="form-field"><label htmlFor="checkout-address">Delivery address</label><input id="checkout-address" value={trip.address} readOnly /></div>}
    <div className="form-field"><label>Choose how you would like to pay</label><label className="payment-choice"><input type="radio" value="mpesa" {...register('payment')} defaultChecked /><Smartphone size={18} /><span><strong>M-Pesa</strong><small>Pay with your mobile money account</small></span></label><label className="payment-choice"><input type="radio" value="card" {...register('payment')} /><CreditCard size={18} /><span><strong>Card</strong><small>Visa or Mastercard</small></span></label></div>
    {challengeRequired && <RecaptchaChallenge siteKey={v2SiteKey} onToken={setCaptchaV2Token} />}
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-primary form-submit" type="submit" disabled={submitting}>{submitting ? 'Preparing your booking...' : 'Confirm booking'} <ArrowRight size={16} /></button><p className="secure-note"><LockKeyhole size={13} /> Your details are sent securely. No payment is charged on this demo site.</p>
    <Link href={car ? `/fleet/${car.slug}` : '/fleet'} className="back-link"><ArrowLeft size={14} /> Back to car details</Link>
  </form>
  <aside className="summary-card"><div className="summary-car"><Image src={car.image} alt={`${car.make} ${car.model}`} fill sizes="400px" /></div><span className="eyebrow">Booking summary</span><h3>{car.make} {car.model}</h3><div className="summary-row"><span>Category</span><strong>{car.category}</strong></div><div className="summary-row"><span>Pickup</span><strong>{trip?.startDate || 'Choose a date'}</strong></div><div className="summary-row"><span>Return</span><strong>{trip?.endDate || 'Choose a date'}</strong></div><div className="summary-row"><span>Duration</span><strong>{trip ? `${trip.days} ${trip.days === 1 ? 'day' : 'days'}` : 'Not selected'}</strong></div><div className="summary-row"><span>Collection</span><strong>{trip?.pickUp === 'delivery' ? 'Nairobi delivery' : 'Self collect'}</strong></div><div className="summary-row summary-grand"><span>Estimated total</span><strong>{formatKes(trip?.total ?? car.price)}</strong></div><p className="notice">Your selected payment method is recorded with your booking. A payment provider needs to be configured before live charges can be accepted.</p></aside></div>;
}
