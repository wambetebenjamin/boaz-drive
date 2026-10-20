type GrecaptchaResponse = { success: boolean; score?: number; action?: string };
type Grecaptcha = { ready: (callback: () => void) => void; execute: (siteKey: string, options: { action: string }) => Promise<string>; render?: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void }) => number };
interface Window { grecaptcha?: Grecaptcha }
