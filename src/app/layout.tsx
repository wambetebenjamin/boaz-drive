import type { Metadata } from 'next';
import Script from 'next/script';
import '../../carbook-master/css/style.css';
import './site.css';
import { CookieConsent, FloatingWhatsApp, LoadingScreen, SiteMotion, VoiceTour } from '@/components/SiteFeatures';
import { Footer, Header } from '@/components/SiteShell';

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export const metadata: Metadata = {
  title: { default: 'Boaz Drive | Car Hire in Nairobi', template: '%s | Boaz Drive' },
  description: 'Book a reliable car hire in Nairobi. Choose from economy cars, SUVs, 4x4s, vans, and luxury rentals, with free delivery around Nairobi.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-KE"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800&display=swap" rel="stylesheet" />
  </head><body>
    <SiteMotion /><LoadingScreen /><Header /><main>{children}</main><Footer />
    <VoiceTour /><FloatingWhatsApp /><CookieConsent />
    {recaptchaSiteKey && <Script src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`} strategy="afterInteractive" />}
  </body></html>;
}
