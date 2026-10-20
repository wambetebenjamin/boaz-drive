'use client';

import { useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

export function RecaptchaChallenge({ siteKey, onToken }: { siteKey?: string; onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  useEffect(() => {
    if (!siteKey || !container.current || !window.grecaptcha?.render) return;
    let mounted = true;
    window.grecaptcha.ready(() => {
      if (mounted && container.current && window.grecaptcha?.render) {
        window.grecaptcha.render(container.current, { sitekey: siteKey, callback: (token) => onTokenRef.current(token), 'expired-callback': () => onTokenRef.current('') });
      }
    });
    return () => { mounted = false; };
  }, [siteKey]);
  return <div className="security-challenge" role="group" aria-label="reCAPTCHA security challenge"><ShieldCheck size={17} /><div><strong>Please confirm you are human.</strong><p>The verification score needs another check. Complete this challenge to proceed.</p>{siteKey ? <div ref={container} /> : <small>Set NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY to enable the visible challenge.</small>}</div></div>;
}
