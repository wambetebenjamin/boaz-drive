'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CarFront, CircleAlert, RefreshCw } from 'lucide-react';

export function NotFoundView() {
  return <section className="error-page"><div><span className="error-icon"><CarFront size={34} /></span><span className="eyebrow">That road ends here</span><h1>This vehicle is not in our fleet.</h1><p>The page may have moved, or the car may no longer be available.</p><Link className="button button-primary" href="/fleet">Back to Fleet <CarFront size={16} /></Link></div></section>;
}
export function ServerErrorView() {
  const router = useRouter();
  return <section className="error-page"><div><span className="error-icon"><CircleAlert size={32} /></span><span className="eyebrow">A bump in the road</span><h1>Something did not go to plan.</h1><p>Please try again, or message Boaz Drive on WhatsApp at +254112272061.</p><div className="receipt-actions" style={{ justifyContent: 'center' }}><button className="button button-primary" onClick={() => router.refresh()}>Try Again <RefreshCw size={15} /></button><a className="button button-dark" href="https://wa.me/254112272061" target="_blank" rel="noreferrer">WhatsApp +254112272061</a></div></div></section>;
}
