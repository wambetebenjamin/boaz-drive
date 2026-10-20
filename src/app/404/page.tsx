import type { Metadata } from 'next';
import { NotFoundView } from '@/components/ErrorViews';
export const metadata: Metadata = { title: 'Vehicle not found' };
export default function NotFoundPage() { return <NotFoundView />; }
