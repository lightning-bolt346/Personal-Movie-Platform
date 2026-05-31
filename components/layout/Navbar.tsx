'use client';
import Link from 'next/link';
import { Search, User, Home, Film, Tv, Compass, Sparkles, Bell, Settings, Rocket } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

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
      {/* ── DESKTOP FLOATING PILL NAV ── */}
      <nav
        className={`hidden md:flex fixed z-[200] left-0 right-0 justify-center px-4 transition-all duration-500 ${scrolled ? 'top-3' : 'top-6'}`}
      >
        <div
          className="group relative flex items-center px-5 py-2.5 gap-5 rounded-full transition-all duration-300 overflow-hidden"
          style={{
            backgroundColor: 'rgba(10, 8, 12, 0.48)',
            backdropFilter: 'blur(24px) saturate(180%) contrast(120%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%) contrast(120%) brightness(1.1)',
            border: '1px solid rgba(255, 165, 80, 0.16)',
            boxShadow: '0 20px 45px -10px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.22), inset 0 -1px 2px rgba(255, 165, 80, 0.12)',
          }}
        >
          {/* ── Dynamic Liquid Glass & Amber Sweeps ── */}
          <div className="absolute left-4 top-0 bottom-0 w-32 pointer-events-none rounded-full amber-glass-glow z-0" />
          <div className="absolute right-4 top-0 bottom-0 w-64 pointer-events-none rounded-full chromatic-glass-overlay z-0" />

          {/* ── Inner Reflections ── */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none overflow-hidden opacity-40 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-60"
            style={{
              background: `
                linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 20%, transparent 50%, rgba(255,255,255,0.02) 80%, rgba(255,255,255,0.2) 100%),
                linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 10%, transparent 90%, rgba(255,255,255,0.1) 100%)
              `
            }}
          />

          {/* ── ZIVOX Logo ── */}
          <Link
            href="/"
            onClick={clearIframes}
            className="flex items-center z-10 transition-all duration-300 hover:opacity-85 active:scale-95 select-none"
            aria-label="ZIVOX Home"
          >
            <Rocket 
              size={17} 
              className="text-white fill-white animate-pulse mr-2" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(249, 115, 22, 0.85))' }}
            />
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

          {/* Nav Links */}
          <div className="flex items-center gap-6 z-10 mx-2">
            {NAV_ITEMS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={clearIframes}
                  className={`relative text-[14px] font-medium tracking-wide transition-all duration-300 hover:-translate-y-[1px] ${
                    active
                      ? 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                      : 'text-white/60 hover:text-white/95'
                  }`}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: 'linear-gradient(to right, #e50914, transparent)' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Icons (Right) */}
          <div className="flex items-center gap-4.5 z-10 ml-2">
            <Link
              href="/search"
              onClick={clearIframes}
              className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Search"
            >
              <Search size={17} strokeWidth={2} />
            </Link>
            <button
              onClick={() => alert("🔔 Notifications: ZIVOX is up to date!")}
              className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={17} strokeWidth={2} />
            </button>
            <button
              onClick={() => alert("⚙️ Settings: High Glassmorphism Redirection is Active!")}
              className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Settings"
            >
              <Settings size={17} strokeWidth={2} />
            </button>
            <Link
              href="/profile"
              onClick={clearIframes}
              className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Profile"
            >
              <User size={17} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM DOCK ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-[200]"
        style={{
          background: 'rgba(5, 5, 5, 0.97)',
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
    </>
  );
}
