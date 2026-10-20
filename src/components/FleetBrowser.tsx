'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { FleetCard } from '@/components/sections';
import { Car, CarCategory } from '@/lib/fleet';

export function FleetBrowser({ cars }: { cars: Car[] }) {
  const [category, setCategory] = useState('All categories');
  const [seats, setSeats] = useState('Any seats');
  const [transmission, setTransmission] = useState('Any transmission');
  const [maxPrice, setMaxPrice] = useState('Any price');
  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get('category');
    if (selected && ['Economy', 'SUV', '4x4', 'Van', 'Luxury'].includes(selected)) setCategory(selected);
  }, []);
  const filtered = useMemo(() => cars.filter((car) =>
    (category === 'All categories' || car.category === category) &&
    (seats === 'Any seats' || car.seats >= Number(seats)) &&
    (transmission === 'Any transmission' || car.transmission === transmission) &&
    (maxPrice === 'Any price' || car.price <= Number(maxPrice))), [cars, category, seats, transmission, maxPrice]);
  return <>
    <div className="fleet-toolbar"><label><span><SlidersHorizontal size={13} /> Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All categories</option>{(['Economy', 'SUV', '4x4', 'Van', 'Luxury'] as CarCategory[]).map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Seats</span><select value={seats} onChange={(event) => setSeats(event.target.value)}><option>Any seats</option><option value="4">4+ seats</option><option value="5">5+ seats</option><option value="7">7+ seats</option></select></label>
      <label><span>Transmission</span><select value={transmission} onChange={(event) => setTransmission(event.target.value)}><option>Any transmission</option><option>Automatic</option><option>Manual</option></select></label>
      <label><span>Max per day</span><select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option>Any price</option><option value="5000">KES 5,000</option><option value="10000">KES 10,000</option><option value="15000">KES 15,000</option><option value="20000">KES 20,000</option></select></label>
    </div>
    <p className="filter-count">Showing {filtered.length} {filtered.length === 1 ? 'vehicle' : 'vehicles'} ready for your plans</p>
    <motion.div layout className="fleet-results">{filtered.map((car, index) => <FleetCard car={car} index={index} key={car.id} />)}</motion.div>
    <AnimatePresence>{filtered.length === 0 && <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><h2>No cars match those filters</h2><p>Try a wider budget or a different category.</p><button className="button button-primary" onClick={() => { setCategory('All categories'); setSeats('Any seats'); setTransmission('Any transmission'); setMaxPrice('Any price'); }}>Clear filters</button></motion.div>}</AnimatePresence>
  </>;
}
