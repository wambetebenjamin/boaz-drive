'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Fuel, UsersRound } from 'lucide-react';
import type { Car } from '@/lib/fleet';
import { formatKes } from '@/lib/fleet';

export function FleetCard({ car, index = 0 }: { car: Car; index?: number }) {
  return <motion.article className="fleet-card" layout whileHover={{ y: -6 }} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .35, delay: Math.min(index * .06, .24) }}>
    <Link href={`/fleet/${car.slug}`} className="fleet-card-image"><Image src={car.image} alt={`${car.make} ${car.model}`} fill sizes="(max-width: 700px) 90vw, (max-width: 1050px) 45vw, 30vw" /><span className="car-category-tag">{car.category}</span><span className="fleet-image-arrow"><ArrowRight size={16} /></span></Link>
    <div className="fleet-card-body"><div className="fleet-card-title"><div><span>{car.make}</span><h3>{car.model}</h3></div><div className="fleet-rate"><strong>{formatKes(car.price)}</strong><small>per day</small></div></div><div className="fleet-meta"><span><UsersRound size={15} /> {car.seats} seats</span><span>{car.transmission}</span><span><Fuel size={15} /> {car.fuel}</span></div><Link href={`/fleet/${car.slug}`} className="fleet-book-link">Book Now <ArrowRight size={15} /></Link></div>
  </motion.article>;
}
