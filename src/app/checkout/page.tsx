import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/CheckoutForm';
import { cars } from '@/lib/fleet';

export const metadata: Metadata = { title: 'Complete your booking' };
export default function CheckoutPage() {
  return <><section className="page-hero"><div className="page-width"><div className="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/fleet">Our fleet</a><span>/</span><span>Checkout</span></div><span className="eyebrow">One last step</span><h1>Make it official.</h1><p>Add your driver details, choose a payment method, and we will take care of the rest.</p></div></section><section className="page-content"><div className="page-width"><CheckoutForm cars={cars} siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} v2SiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY} /></div></section></>;
}
