'use client';
import Link from 'next/link';
import { Search, User, Home, Film, Tv, Compass, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/tv', label: 'Series' },
  { href: '/anime', label: 'Anime' },
  { href: '/discover', label: 'Discover' },
];

const MOBILE_DOCK_ITEMS = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/movies', label: 'Movies', Icon: Film },
  { href: '/tv', label: 'Series', Icon: Tv },
  { href: '/anime', label: 'Anime', Icon: Sparkles },
  { href: '/discover', label: 'Discover', Icon: Compass },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const clearIframes = () => {
    document.querySelectorAll('iframe').forEach(i => (i.src = ''));
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <>
      {/* ── DESKTOP FLOATING CAPSULE NAV ── */}
      <nav
        className={`hidden md:flex fixed z-[200] left-1/2 -translate-x-1/2 w-full max-w-[820px] transition-all duration-500 ${
          scrolled ? 'top-4 px-6' : 'top-6 px-0'
        }`}
      >
        <div className="group relative w-full flex items-center justify-between px-6 py-3 rounded-full overflow-hidden transition-all duration-300">
          
          {/* Layer 1: Glass Body Refraction Sibling (standard blur + wobbly SVG displacement filter) */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none transition-all duration-300"
            style={{
              backdropFilter: 'blur(28px) saturate(220%) contrast(120%) brightness(0.96)',
              WebkitBackdropFilter: 'blur(28px) saturate(220%) contrast(120%) brightness(0.96)',
              filter: 'url(#trippy-glass-distortion)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
              backgroundColor: 'rgba(10, 8, 12, 0.38)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.8),
                inset 0 1.5px 0 0 rgba(255, 255, 255, 0.38),
                inset 0 -1.5px 2px 0 rgba(255, 255, 255, 0.08)
              `,
              zIndex: -1,
            }}
          />

          {/* Layer 2: Soft Subtle Gradient Light Reflection shine overlay */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-60 -z-10"
            style={{
              background: `
                linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 25%, transparent 50%, rgba(255,255,255,0.2) 100%),
                linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 12%, transparent 88%, rgba(255,255,255,0.1) 100%)
              `
            }}
          />

          {/* ── Left logo: ZIVOX ── */}
          <Link
            href="/"
            onClick={clearIframes}
            className="flex items-center z-10 transition-all duration-300 hover:opacity-80 active:scale-95 select-none"
            aria-label="ZIVOX Home"
          >
            <span
              className="font-display font-black tracking-[-0.05em] text-[18px] leading-none"
              style={{
                background: 'linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.65) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.04em',
              }}
            >
              ZIV
            </span>
            <span
              className="font-display font-black text-[18px] leading-none mx-[1px]"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2px solid rgba(229, 9, 20, 0.9)',
                boxShadow: '0 0 10px rgba(229,9,20,0.5), inset 0 0 6px rgba(229,9,20,0.2)',
                WebkitTextFillColor: 'transparent',
              }}
            >
            </span>
            <span
              className="font-display font-black tracking-[-0.05em] text-[18px] leading-none"
              style={{
                background: 'linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.65) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.04em',
              }}
            >
              X
            </span>
          </Link>

          {/* ── Center links: Sliding Pill active state ── */}
          <div className="flex items-center gap-1.5 z-10 mx-2">
            {NAV_ITEMS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={clearIframes}
                  className={`relative px-4 py-1.5 rounded-full text-[14px] font-semibold tracking-wide transition-colors duration-300 active:scale-95 ${
                    active ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-white/12 border border-white/10 shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right-side icons: Action Buttons ── */}
          <div className="flex items-center gap-4.5 z-10">
            <Link
              href="/search"
              onClick={clearIframes}
              className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Search"
            >
              <Search size={17} strokeWidth={2.2} />
            </Link>
            <Link
              href="/profile"
              onClick={clearIframes}
              className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Profile"
            >
              <User size={17} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM DOCK ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-[200]"
        style={{
          background: 'rgba(5, 5, 5, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-around py-2 px-2">
          {MOBILE_DOCK_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={clearIframes}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 ${
                  active ? 'text-white' : 'text-white/35 hover:text-white/70'
                }`}
              >
                <div className="relative">
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                  {active && (
                    <span
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-crimson-500"
                      style={{ boxShadow: '0 0 6px rgba(229,9,20,0.8)' }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Trippy Glass Liquid Water-Bottle Displacement Map Filter (subtle, not cartoonish) ── */}
      <svg className="absolute w-0 h-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ width: 0, height: 0, position: 'absolute' }}>
        <defs>
          <filter id="trippy-glass-distortion" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.012 0.04" 
              numOctaves="3" 
              result="noise" 
              seed="3"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="18" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}
