import type { Metadata } from 'next';
import { cars } from '@/lib/fleet';
import { FleetBrowser } from '@/components/FleetBrowser';

export const metadata: Metadata = { title: 'Browse the fleet' };

export default function FleetPage() {
  return <><section className="page-hero"><div className="page-width"><div className="breadcrumbs"><a href="/">Home</a><span>/</span><span>Our fleet</span></div><span className="eyebrow">Your trip, your kind of car</span><h1>Good cars for<br />going places.</h1><p>Carefully prepared cars, clear daily rates, and a friendly team in Nairobi. Find one that feels right for your next journey.</p></div></section><section className="page-content"><div className="page-width"><FleetBrowser cars={cars} /></div></section></>;
}
