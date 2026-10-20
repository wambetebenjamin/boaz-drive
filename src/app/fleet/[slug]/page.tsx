import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { getCar, formatKes, cars } from '@/lib/fleet';
import { DetailBookingPanel } from '@/components/DetailBookingPanel';

export function generateStaticParams() { return cars.map((car) => ({ slug: car.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const car = getCar(slug);
  return { title: car ? `${car.make} ${car.model} rental` : 'Vehicle not found' };
}

export default async function CarDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) notFound();
  const gallery = [car.image, '/images/kenya-open-road.jpg', '/images/green-4x4.jpg'];
  const specs = [['Category', car.category], ['Seats', `${car.seats} people`], ['Transmission', car.transmission], ['Fuel', car.fuel], ['Luggage', `${car.luggage} bags`], ['Daily rate', formatKes(car.price)]];
  return <><section className="page-hero"><div className="page-width"><div className="breadcrumbs"><Link href="/">Home</Link><ChevronRight size={12} /><Link href="/fleet">Our fleet</Link><ChevronRight size={12} /><span>{car.model}</span></div><span className="eyebrow">{car.category} collection</span><h1>{car.make} {car.model}</h1><p>{car.description}</p></div></section><section className="page-content"><div className="page-width detail-wrap"><div><div className="detail-photo"><Image src={gallery[0]} alt={`${car.make} ${car.model} rental car`} fill priority sizes="(max-width: 760px) 100vw, 60vw" /></div><div className="detail-thumbs">{gallery.map((image, index) => <div className="detail-thumb" key={`${image}-${index}`}><Image src={image} alt={`${car.model} view ${index + 1}`} fill sizes="(max-width: 760px) 30vw, 20vw" /></div>)}</div><div className="detail-copy"><span className="eyebrow">A little about this car</span><h2>Ready when you are.</h2><p>{car.description} We keep the details straightforward, so you can focus on where you are going.</p><div className="spec-grid">{specs.map(([label, value]) => <div className="spec-item" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><h3 className="spec-heading">Included with your rental</h3><ul className="feature-list">{car.features.map((feature) => <li key={feature}><Check size={14} /> {feature}</li>)}</ul><p className="detail-note"><ArrowLeft size={13} /> All rentals include local roadside support.</p></div></div><DetailBookingPanel car={car} /></div></section></>;
}
