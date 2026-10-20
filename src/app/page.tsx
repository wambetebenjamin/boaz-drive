'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, Compass, MapPin, ShieldCheck, Wrench } from 'lucide-react';
import { categories, cars, formatKes } from '@/lib/fleet';
import { FleetCard } from '@/components/sections';

const MotionLink = motion.create(Link);
const routes = [
  { from: 'Nairobi', to: 'Mombasa', distance: '490 km', time: '8 hr 15 min', image: '/images/coastal-drive.jpg' },
  { from: 'Nairobi', to: 'Kisumu', distance: '345 km', time: '6 hr 20 min', image: '/images/mountain-drive.jpg' },
  { from: 'Nairobi', to: 'Nakuru', distance: '160 km', time: '2 hr 45 min', image: '/images/road-trip.jpg' },
  { from: 'Nairobi', to: 'Eldoret', distance: '315 km', time: '5 hr 45 min', image: '/images/savannah-drive.jpg' },
];
const benefits = [
  { icon: ShieldCheck, title: 'Fully insured fleet', copy: 'Enjoy every kilometre knowing your rental is covered.' },
  { icon: Clock3, title: 'Help, day or night', copy: 'Our local support team is here whenever the road surprises you.' },
  { icon: Wrench, title: 'Ready for the road', copy: 'Every vehicle is cleaned, checked, and serviced before pickup.' },
  { icon: MapPin, title: 'Delivery around Nairobi', copy: 'Get your car brought to your door at no extra cost in Nairobi.' },
];
const quotes = [
  { quote: 'We landed late in Nairobi and the car was waiting right outside. Such a thoughtful, easy start to our trip.', name: 'Amina N.', place: 'Nairobi, Kenya', initials: 'AN' },
  { quote: 'A comfortable drive to Naivasha and back, with clear updates the whole way. I will book again.', name: 'Brian O.', place: 'Kampala, Uganda', initials: 'BO' },
  { quote: 'The 4x4 handled our family trip beautifully. Booking was simple and the team was genuinely helpful.', name: 'Neema K.', place: 'Arusha, Tanzania', initials: 'NK' },
];

export default function Home() {
  return <>
    <section className="hero-home">
      <Image src="/images/kenya-open-road.jpg" alt="A four wheel drive on an open Kenyan savannah road" fill priority sizes="100vw" className="hero-photo" data-parallax />
      <div className="hero-shade" />
      <div className="hero-content page-width">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          <span className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Nairobi car hire, made easy</span>
          <h1>Your keys.<br /><span>Your road.</span> Your time.</h1>
          <p>Good drives begin with a little more freedom. Find a car that fits your plans and let the journey take it from there.</p>
          <div className="hero-buttons"><Link href="/fleet" className="button button-primary button-large">Browse fleet <ArrowRight size={18} /></Link><Link href="/fleet" className="button button-outline button-large">Book now <ArrowUpRight size={17} /></Link></div>
          <div className="hero-proof"><span className="proof-check"><Check size={13} /></span> Fully insured <i /> Free Nairobi delivery <i /> Local support, always</div>
        </motion.div>
        <div className="hero-caption"><span className="caption-rule" /> Built for the long way round</div>
        <div className="hero-scroll"><span>Scroll to explore</span><ArrowDown size={15} /></div>
      </div>
      <div className="hero-index"><span>01</span> / 04</div>
    </section>

    <section className="quick-book page-width" aria-label="Find a car"><div className="quick-book-intro"><span className="eyebrow">Start your journey</span><h2>Where to next?</h2></div><form action="/fleet" className="quick-book-form">
      <label><span>Pickup date</span><input aria-label="Pickup date" type="date" name="startDate" min={new Date().toISOString().slice(0, 10)} /></label>
      <label><span>Return date</span><input aria-label="Return date" type="date" name="endDate" /></label>
      <label><span>Pickup location</span><select aria-label="Pickup location" name="location"><option>Nairobi, Kenya</option><option>Jomo Kenyatta Airport</option><option>Westlands</option><option>Other location</option></select></label>
      <button className="button button-dark" type="submit">Find a car <ArrowRight size={17} /></button>
    </form></section>

    <section className="section-pad category-section" id="fleet"><div className="page-width">
      <div className="section-heading section-heading-split"><div><span className="eyebrow">The right ride for the road ahead</span><h2>Find your kind<br />of <em>freedom.</em></h2></div><div className="section-aside"><p>From quick city errands to open-road weekends, there is a Boaz Drive for every plan.</p><Link className="text-link" href="/fleet">Explore all vehicles <ArrowRight size={16} /></Link></div></div>
      <div className="category-grid">{categories.map((category, i) => <MotionLink className={`category-tile category-tile-${i + 1}`} href={`/fleet?category=${encodeURIComponent(category.name)}`} key={category.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .4, delay: i * .08 }}>
        <Image src={category.image} alt={`${category.name} rental car`} fill sizes="(max-width: 720px) 50vw, 22vw" />
        <div className="category-cover" /><span className="category-number">0{i + 1}</span><div className="category-info"><span>{category.intro}</span><h3>{category.name}</h3><small>From {formatKes(category.price)} <b>/ day</b></small></div><span className="category-arrow"><ArrowUpRight size={18} /></span>
      </MotionLink>)}</div>
    </div></section>

    <section className="section-pad picks-section"><div className="page-width">
      <div className="section-heading section-heading-split"><div><span className="eyebrow">Good choices, ready to go</span><h2>Our most-loved<br /><em>rides.</em></h2></div><div className="section-aside"><p>Each car is selected, checked, and prepared for a comfortable trip through Kenya.</p><Link className="text-link" href="/fleet">View the full fleet <ArrowRight size={16} /></Link></div></div>
      <div className="fleet-feature-grid">{cars.slice(0, 3).map((car, index) => <FleetCard car={car} key={car.id} index={index} />)}</div>
    </div></section>

    <section className="routes-section" id="routes"><div className="page-width routes-layout"><div className="routes-intro"><span className="eyebrow eyebrow-light">Make room for the detour</span><h2>Kenya looks<br />better <em>by road.</em></h2><p>Pack a good playlist, pick a direction, and make the stops you want to make.</p><Link className="button button-outline button-large" href="/fleet">Choose your car <ArrowRight size={16} /></Link><span className="routes-mark"><Compass size={75} strokeWidth={.8} /></span></div>
      <div className="route-list">{routes.map((route, index) => <Link className="route-row" href="/fleet" key={route.to}><span className="route-index">0{index + 1}</span><div className="route-title"><span>{route.from} <i>to</i></span><strong>{route.to}</strong></div><div className="route-details"><span>{route.distance}</span><small>about {route.time}</small></div><ArrowUpRight className="route-arrow" size={20} /><span className="route-photo"><Image src={route.image} alt={`Road trip route from ${route.from} to ${route.to}`} fill sizes="150px" /></span></Link>)}</div>
    </div></section>

    <section className="section-pad how-section" id="how-it-works"><div className="page-width"><div className="section-heading centered-heading"><span className="eyebrow">Easy does it</span><h2>Four small steps.<br /><em>A whole lot of road.</em></h2></div><div className="steps-grid">{[
      ['01', 'Choose your car', 'Find the ride that feels right for your trip.'],
      ['02', 'Pick your dates', 'Tell us when you are heading out and coming back.'],
      ['03', 'Confirm and pay', 'Book securely with M-Pesa or a card.'],
      ['04', 'Collect or relax', 'Pick up in Nairobi or have us deliver to you.'],
    ].map(([n, title, copy], i) => <motion.article className="step-card" key={n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ delay: i * .1 }}><span className="step-number">{n}</span><span className="step-line" /><h3>{title}</h3><p>{copy}</p></motion.article>)}</div></div></section>

    <section className="benefits-section" id="about"><div className="page-width benefits-layout"><div className="benefits-photo"><Image src="/images/green-4x4.jpg" alt="A green four wheel drive on a dusty East African road" fill sizes="(max-width: 800px) 100vw, 46vw" /><span className="photo-stamp"><ShieldCheck size={20} /><b>Driven with care</b><small>Since day one</small></span></div><div className="benefits-copy"><span className="eyebrow">People you can count on</span><h2>More than a car.<br /><em>Peace of mind.</em></h2><p className="benefits-lead">A good rental is about more than getting from A to B. It is knowing your car is ready, your booking is clear, and there is a person to call if you need one.</p><div className="benefit-list">{benefits.map(({ icon: Icon, title, copy }) => <div className="benefit-item" key={title}><span className="benefit-icon"><Icon size={19} /></span><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div><Link className="text-link" href="/fleet">Find a car for your next trip <ArrowRight size={16} /></Link></div></div></section>

    <section className="section-pad testimonial-section"><div className="page-width"><div className="section-heading section-heading-split"><div><span className="eyebrow">Good trips make good stories</span><h2>From the people<br />who <em>came back.</em></h2></div><div className="rating-note"><span>4.9 / 5</span><strong>Driver rating</strong><small>From happy local drivers</small></div></div><div className="testimonials-grid">{quotes.map((item, i) => <motion.article className="quote-card" key={item.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .12 }}><span className="quote-mark">“</span><div className="quote-rating">Rated 5 / 5 by this renter</div><p>“{item.quote}”</p><div className="quote-person"><span>{item.initials}</span><div><strong>{item.name}</strong><small>{item.place}</small></div></div></motion.article>)}</div></div></section>

    <section className="closing-cta"><Image src="/images/savannah-drive.jpg" alt="A road disappearing into an East African landscape" fill sizes="100vw" /><div className="closing-overlay" /><div className="page-width closing-inner"><span className="eyebrow eyebrow-light">Your next story starts here</span><h2>Find the road<br /><em>that feels like yours.</em></h2><Link href="/fleet" className="button button-primary button-large">Browse the fleet <ArrowRight size={17} /></Link></div></section>
  </>;
}
