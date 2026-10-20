'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { RecaptchaChallenge } from '@/components/RecaptchaChallenge';
import { useRouter } from 'next/navigation';
import { ArrowRight, CarFront, LockKeyhole } from 'lucide-react';

const signInSchema = z.object({ email: z.string().email('Enter a valid email address.'), password: z.string().min(8, 'Your password must be at least 8 characters.') });
const signUpSchema = z.object({ name: z.string().min(2, 'Enter your full name.'), email: z.string().email('Enter a valid email address.'), password: z.string().min(10, 'Use at least 10 characters.'), idNumber: z.string().min(4, 'Enter a valid ID or passport number.'), phone: z.string().min(9, 'Enter a valid phone number.') });
type Props = { mode: 'signin' | 'signup'; siteKey?: string; v2SiteKey?: string; googleEnabled: boolean };

function captchaToken(siteKey: string | undefined, action: string) {
  return new Promise<string>((resolve, reject) => {
    if (!window.grecaptcha || !siteKey) return reject(new Error('reCAPTCHA is not configured. Please contact Boaz Drive on WhatsApp to continue.'));
    window.grecaptcha.ready(() => window.grecaptcha!.execute(siteKey, { action }).then(resolve, reject));
  });
}

export function AuthForm({ mode, siteKey, v2SiteKey, googleEnabled }: Props) {
  const isSignup = mode === 'signup';
  const router = useRouter();
  const callbackUrl = typeof window === 'undefined' ? '/my-bookings' : new URLSearchParams(window.location.search).get('callbackUrl') || '/my-bookings';
  const [error, setError] = useState('');
  const [challenge, setChallenge] = useState(false);
  const [captchaV2Token, setCaptchaV2Token] = useState('');
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: isSignup ? { name: '', email: '', password: '', idNumber: '', phone: '' } : { email: '', password: '' } });
  const submit = handleSubmit(async (values) => {
    setBusy(true); setError(''); setChallenge(false);
    try {
      const token = captchaV2Token || await captchaToken(siteKey, isSignup ? 'signup' : 'signin');
      const tokenVersion = captchaV2Token ? 'v2' : 'v3';
      if (isSignup) {
        const parsed = signUpSchema.safeParse(values);
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || 'Check your details.');
        const response = await fetch('/api/auth/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...parsed.data, recaptchaToken: token, recaptchaVersion: tokenVersion }) });
        const result = await response.json() as { error?: string; challengeRequired?: boolean };
        if (!response.ok) { setChallenge(Boolean(result.challengeRequired)); throw new Error(result.error || 'We could not create your account.'); }
        router.push('/auth/signin?created=1');
      } else {
        const parsed = signInSchema.safeParse(values);
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || 'Check your details.');
        const result = await signIn('credentials', { email: parsed.data.email, password: parsed.data.password, recaptchaToken: token, recaptchaVersion: tokenVersion, redirect: false, callbackUrl });
        if (result?.error) throw new Error('Those details could not be verified. Check your email and password, then try again.');
        router.push(result?.url || callbackUrl); router.refresh();
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Please try again.'); }
    finally { setBusy(false); }
  });
  const googleLogin = async () => {
    setError(''); setChallenge(false); setBusy(true);
    try {
      const token = captchaV2Token || await captchaToken(siteKey, 'signin');
      const version = captchaV2Token ? 'v2' : 'v3';
      const response = await fetch('/api/recaptcha/verify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token, action: 'signin', version }) });
      const result = await response.json() as { error?: string; challengeRequired?: boolean };
      if (!response.ok) { setChallenge(Boolean(result.challengeRequired)); throw new Error(result.error || 'Security check failed.'); }
      await signIn('google', { callbackUrl });
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Google sign in could not start.'); setBusy(false); }
  };

  return <div className="auth-layout"><div className="auth-image"><Image src="/images/kenya-open-road.jpg" alt="Open road across the East African savannah" fill sizes="50vw" /><div className="auth-image-copy"><span className="eyebrow eyebrow-light">A little more room to roam</span><h2>Your next favourite<br />drive is out there.</h2><p>Keep your details handy and make your next Nairobi car hire even easier.</p></div></div>
    <div className="auth-form-wrap"><form className="auth-form" onSubmit={submit} noValidate><span className="eyebrow">{isSignup ? 'Create your Boaz Drive account' : 'Good to see you again'}</span><h1>{isSignup ? 'Join the journey.' : 'Welcome back.'}</h1><p>{isSignup ? 'Set up your account to keep your bookings close.' : 'Sign in to manage your bookings and upcoming trips.'}</p>
      <button className="button google-button" type="button" disabled={!googleEnabled || busy} onClick={googleLogin}><span className="google-g">G</span> Continue with Google</button>
      {!googleEnabled && <p className="provider-note">Google sign in becomes available when OAuth keys are configured.</p>}
      <div className="or-divider">or use your email</div>
      {isSignup && <div className="form-field"><label htmlFor="name">Full name</label><input id="name" placeholder="Your name" {...register('name')} />{errors.name && <small>{String(errors.name.message)}</small>}</div>}
      <div className="form-field"><label htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />{errors.email && <small>{String(errors.email.message)}</small>}</div>
      <div className="form-field"><label htmlFor="password">Password</label><input id="password" type="password" placeholder={isSignup ? 'At least 10 characters' : 'Your password'} autoComplete={isSignup ? 'new-password' : 'current-password'} {...register('password')} />{errors.password && <small>{String(errors.password.message)}</small>}</div>
      {isSignup && <div className="form-grid"><div className="form-field"><label htmlFor="idNumber">National ID or passport</label><input id="idNumber" placeholder="ID number" {...register('idNumber')} />{errors.idNumber && <small>{String(errors.idNumber.message)}</small>}</div><div className="form-field"><label htmlFor="phone">Phone number</label><input id="phone" type="tel" placeholder="+254 7XX XXX XXX" {...register('phone')} />{errors.phone && <small>{String(errors.phone.message)}</small>}</div></div>}
      {challenge && <RecaptchaChallenge siteKey={v2SiteKey} onToken={setCaptchaV2Token} />}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary full-width auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button>
      <p className="auth-secure"><LockKeyhole size={12} /> Your information is protected.</p>
      <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to Boaz Drive?'} <Link href={isSignup ? '/auth/signin' : '/auth/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link></p>
      <Link className="auth-back" href="/"><CarFront size={14} /> Back to Boaz Drive</Link>
    </form></div></div>;
}
