'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, MessageCircle, Settings2, Volume2, VolumeX, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const consentKey = 'boaz_drive_consent';
const tourScript = 'Welcome to Boaz Drive. We make hiring a car in Nairobi simple and straightforward. Browse our fleet of economy cars, SUVs, 4x4s, and vans. Pick your dates, pay with M-Pesa, and we deliver the car to you or you collect from us. All cars are fully insured and serviced. Your road trip starts here.';

type Consent = { necessary: true; functional: boolean; analytics: boolean; marketing: boolean };

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [reduced, setReduced] = useState(false);
  const close = useCallback(() => {
    sessionStorage.setItem('boaz_drive_loaded', 'yes');
    setVisible(false);
  }, []);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!sessionStorage.getItem('boaz_drive_loaded')) setVisible(true);
    const skipTimer = window.setTimeout(() => setCanSkip(true), 1000);
    const start = Date.now();
    const ticker = window.setInterval(() => {
      const value = Math.min(100, Math.round(((Date.now() - start) / 2700) * 100));
      setProgress(value);
      if (value >= 100) {
        window.clearInterval(ticker);
        close();
      }
    }, 40);
    return () => { window.clearTimeout(skipTimer); window.clearInterval(ticker); };
  }, [close]);

  return <AnimatePresence>{visible && <motion.div className="loader-screen" role="status" aria-live="polite" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45 }}>
    {!reduced && <div className="loader-track"><span className="loader-road" /><svg className="loader-car" viewBox="0 0 72 34" aria-hidden="true"><path d="M9 9.5 15 4h34l9 5.5 7 3.5v12H7v-9.5l2-6Z" fill="currentColor"/><path d="M18 7h14v7H12l6-7Zm17 0h12l7 7H35V7Z" fill="#f9fbf8"/><path d="M4 17h64M7 22h58" stroke="currentColor" strokeWidth="2"/><circle cx="18" cy="25" r="5" fill="#f9fbf8" stroke="currentColor" strokeWidth="3"/><circle cx="53" cy="25" r="5" fill="#f9fbf8" stroke="currentColor" strokeWidth="3"/></svg></div>}
    <p className="loader-brand">Boaz Drive</p><div className="loader-count">{progress}<span>%</span></div>
    {canSkip && <button className="loader-skip" onClick={close}>Skip</button>}
  </motion.div>}</AnimatePresence>;
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [manage, setManage] = useState(false);
  const [draft, setDraft] = useState<Consent>({ necessary: true, functional: false, analytics: false, marketing: false });
  useEffect(() => {
    try { const stored = localStorage.getItem(consentKey); if (stored) setConsent(JSON.parse(stored) as Consent); } catch { setConsent(null); }
  }, []);
  const save = (value: Consent) => { localStorage.setItem(consentKey, JSON.stringify(value)); setConsent(value); setManage(false); };
  return <>
    {!consent && <aside className="cookie-banner" aria-label="Cookie preferences">
      <div className="cookie-copy"><span className="cookie-eyebrow">Your privacy matters</span><p>We use essential cookies to keep bookings working. You can choose whether to allow optional cookies. Read our <a href="/legal/cookie-policy">cookie policy</a>.</p></div>
      <div className="cookie-actions"><button className="button button-quiet" onClick={() => { setDraft({ necessary: true, functional: false, analytics: false, marketing: false }); setManage(true); }}><Settings2 size={16} /> Manage Preferences</button><button className="button button-primary" onClick={() => save({ necessary: true, functional: true, analytics: true, marketing: true })}>Accept All <Check size={16} /></button></div>
    </aside>}
    <AnimatePresence>{manage && <motion.div className="modal-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-title" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}>
        <button className="modal-close" onClick={() => setManage(false)} aria-label="Close preferences"><X size={19} /></button><span className="eyebrow">Cookie choices</span><h2 id="consent-title">Set your preferences</h2><p>Necessary cookies support secure booking and cannot be switched off. Choose any optional cookies you are comfortable with.</p>
        {(['necessary', 'functional', 'analytics', 'marketing'] as const).map((name) => <label className="toggle-row" key={name}><span><strong>{name[0].toUpperCase() + name.slice(1)}</strong><small>{name === 'necessary' ? 'Required for core services' : `Optional ${name} cookies`}</small></span><input type="checkbox" checked={draft[name]} disabled={name === 'necessary'} onChange={(event) => setDraft({ ...draft, [name]: event.target.checked })} /></label>)}
        <button className="button button-primary full-width" onClick={() => save(draft)}>Save my choices</button>
      </motion.section>
    </motion.div>}</AnimatePresence>
  </>;
}

export function VoiceTour() {
  const [speaking, setSpeaking] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const started = useRef(false);
  const speak = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(tourScript);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.lang = 'en-KE';
    utterance.onstart = () => { setSpeaking(true); setHasPlayed(true); };
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);
  useEffect(() => {
    const launch = () => {
      if (started.current) return;
      started.current = true;
      window.removeEventListener('scroll', launch);
      window.removeEventListener('click', launch, true);
      window.setTimeout(() => { if (!window.speechSynthesis?.speaking) speak(); }, 180);
    };
    window.addEventListener('scroll', launch, { once: true, passive: true });
    window.addEventListener('click', launch, { once: true, capture: true });
    return () => { window.removeEventListener('scroll', launch); window.removeEventListener('click', launch, true); };
  }, [speak]);
  return <button className={`floating-tour ${speaking ? 'is-speaking' : ''}`} onClick={speak} aria-label={speaking ? 'Site voice tour, click to mute' : hasPlayed ? 'Replay tour' : 'Site voice tour, click to mute'} title="Hear what this site is about">{speaking ? <Volume2 size={22} /> : <VolumeX size={22} />}<span className="sr-only">{hasPlayed && !speaking ? 'Replay tour' : 'Hear what this site is about'}</span></button>;
}

export function FloatingWhatsApp() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254112272061';
  const message = 'Hello Boaz Drive, I would like to hire a car or ask about availability.';
  return <a className="floating-whatsapp" href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" title="Chat with us on WhatsApp"><MessageCircle size={23} fill="currentColor" /></a>;
}

export function SiteMotion() {
  useEffect(() => {
    let smooth: { destroy: () => void } | undefined;
    let context: { revert: () => void } | undefined;
    let alive = true;
    const init = async () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced) {
        const [{ default: Lenis }, { gsap }] = await Promise.all([import('lenis'), import('gsap')]);
        if (!alive) return;
        smooth = new Lenis({ autoRaf: true, smoothWheel: true });
        const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
        const setters = targets.map((element) => gsap.quickSetter(element, 'y', 'px'));
        const parallax = () => setters.forEach((setter, index) => setter(window.scrollY * -0.12));
        window.addEventListener('scroll', parallax, { passive: true });
        parallax();
        context = { revert: () => { window.removeEventListener('scroll', parallax); gsap.set(targets, { clearProps: 'transform' }); } };
      }
    };
    void init();
    return () => { alive = false; smooth?.destroy(); context?.revert(); };
  }, []);
  return null;
}
