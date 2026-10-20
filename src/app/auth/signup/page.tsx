import type { Metadata } from 'next';
import { AuthForm } from '@/components/AuthForm';
export const metadata: Metadata = { title: 'Create an account' };
export default function SignUpPage() { return <AuthForm mode="signup" siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} v2SiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY} googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />; }
