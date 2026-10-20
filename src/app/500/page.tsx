import type { Metadata } from 'next';
import { ServerErrorView } from '@/components/ErrorViews';
export const metadata: Metadata = { title: 'Something went wrong' };
export default function ServerErrorPage() { return <ServerErrorView />; }
