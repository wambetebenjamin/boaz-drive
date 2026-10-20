'use client';
import { useEffect } from 'react';
import { ServerErrorView } from '@/components/ErrorViews';
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <div onClick={(event) => { if ((event.target as HTMLElement).closest('[data-reset-error]')) reset(); }}><ServerErrorView /></div>;
}
