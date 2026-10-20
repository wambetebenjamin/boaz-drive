'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CarFront, Menu, X, ArrowUpRight, Instagram, Facebook, Youtube } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const links = [{ href: '/fleet', label: 'Our fleet' }, { href: '/#how-it-works', label: 'How it works' }, { href: '/#routes', label: 'Road trips' }, { href: '/#about', label: 'About us' }];

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="nav-wrap">
    <Link className="brand" href="/" aria-label="Boaz Drive home"><span className="brand-mark"><CarFront size={24} strokeWidth={2.1} /></span><span className="brand-text">boaz<span>drive</span><small>NAIROBI, KENYA</small></span></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
    <div className="nav-actions"><Link className="nav-signin" href="/auth/signin">Sign in</Link><Link className="button button-primary nav-book" href="/fleet">Book a car <ArrowUpRight size={16} /></Link></div>
    <button className="mobile-menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={21} /> : <Menu size={21} />}</button>
  </div>
  <AnimatePresence>{open && <motion.nav className="mobile-drawer" aria-label="Mobile navigation" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: .24 }}>{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}<Link href="/auth/signin" onClick={() => setOpen(false)}>Sign in</Link><Link className="button button-primary" href="/fleet" onClick={() => setOpen(false)}>Browse fleet</Link></motion.nav>}</AnimatePresence>
  </header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Link className="brand brand-inverse" href="/"><span className="brand-mark"><CarFront size={24} /></span><span className="brand-text">boaz<span>drive</span><small>NAIROBI, KENYA</small></span></Link><p>Your keys. Your road. Your time.<br />Good drives begin with a little more freedom.</p><a className="footer-whatsapp" href="https://wa.me/254112272061?text=Hello%20Boaz%20Drive%2C%20I%20would%20like%20to%20hire%20a%20car%20or%20ask%20about%20availability." target="_blank" rel="noreferrer">Talk to our team <ArrowUpRight size={14} /></a></div>
    <div className="footer-col"><h3>Discover</h3><Link href="/fleet">Browse all cars</Link><Link href="/fleet?category=4x4">4x4 rentals</Link><Link href="/fleet?category=SUV">SUV rentals</Link><Link href="/#routes">Popular routes</Link></div>
    <div className="footer-col"><h3>Helpful links</h3><Link href="/my-bookings">My bookings</Link><Link href="/auth/signin">Sign in</Link><Link href="/legal/terms">Rental terms</Link><Link href="/legal/privacy-policy">Privacy policy</Link><Link href="/legal/cookie-policy">Cookie policy</Link></div>
    <div className="footer-col footer-contact"><h3>Here when you need us</h3><p>Nairobi, Kenya</p><a href="tel:+254112272061">+254 112 272 061</a><a href="mailto:hello@boazdrive.co.ke">hello@boazdrive.co.ke</a><div className="social-row"><a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={17} /></a><a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={17} /></a><a aria-label="YouTube" href="https://youtube.com" target="_blank" rel="noreferrer"><Youtube size={17} /></a></div></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} Boaz Drive. Made for the road ahead.</span><span>Fully insured. Locally supported.</span></div></footer>;
}
