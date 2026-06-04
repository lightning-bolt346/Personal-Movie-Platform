'use client';
import Link from 'next/link';
import { Search, User, Home, Film, Tv, Compass, Sparkles, CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SettingsModal } from '@/components/ui/SettingsModal';
import { Settings } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/tv', label: 'Series' },
  { href: '/anime', label: 'Anime' },
  { href: '/discover', label: 'Discover' },
  { href: '/schedule', label: 'Schedule' },
];

const MOBILE_DOCK_ITEMS = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/movies', label: 'Movies', Icon: Film },
  { href: '/tv', label: 'Series', Icon: Tv },
  { href: '/discover', label: 'Discover', Icon: Compass },
  { href: '/schedule', label: 'Schedule', Icon: CalendarDays },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  if (pathname?.startsWith('/watch')) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center px-4 py-3 md:px-6 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
      >
        <div className="flex items-center gap-3 bg-void-950/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 pointer-events-auto shadow-xl">
           <Link href="/" onClick={clearIframes} className="flex items-center z-10 transition-all duration-300 hover:opacity-80 active:scale-95 select-none" aria-label="ZIVOX Home">
             <span
               className="font-display font-black tracking-[-0.05em] text-[16px] leading-none"
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
               className="font-display font-black text-[16px] leading-none mx-[1px]"
               style={{
                 display: 'inline-flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 width: '16px',
                 height: '16px',
                 borderRadius: '50%',
                 border: '2px solid rgba(229, 9, 20, 0.9)',
                 boxShadow: '0 0 10px rgba(229,9,20,0.5)',
                 WebkitTextFillColor: 'transparent',
               }}
             >
             </span>
             <span
               className="font-display font-black tracking-[-0.05em] text-[16px] leading-none"
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
           <div className="w-[1px] h-4 bg-white/15" />
           <Link href="/search" onClick={clearIframes} className="text-white/55 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"><Search size={15} strokeWidth={2.5} /></Link>
           <Link href="/profile" onClick={clearIframes} className="text-white/55 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"><User size={15} strokeWidth={2.5} /></Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* ── MOBILE TOP NAV ── */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-[200] px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.8) 60%, transparent)' }}>
        <Link href="/" onClick={clearIframes} className="flex items-center z-10 transition-all duration-300 hover:opacity-80 active:scale-95 select-none" aria-label="ZIVOX Home">
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
        <div className="flex items-center gap-4 z-10">
          <Link href="/search" onClick={clearIframes} className="text-white hover:text-white/80 transition-all duration-300 hover:scale-110 active:scale-95"><Search size={20} strokeWidth={2.5} /></Link>
          <div className="w-[1px] h-5 bg-white/30" />
          <button onClick={() => setIsSettingsOpen(true)} className="text-white hover:text-white/80 transition-all duration-300 hover:scale-110 active:scale-95"><Settings size={20} strokeWidth={2.5} /></button>
          <Link href="/profile" onClick={clearIframes} className="text-white hover:text-white/80 transition-all duration-300 hover:scale-110 active:scale-95"><User size={20} strokeWidth={2.5} /></Link>
        </div>
      </nav>

      {/* ── DESKTOP FLOATING PILL NAV ── */}
      <nav
        className={`hidden md:flex fixed z-[200] left-0 right-0 justify-center px-4 transition-all duration-500 ${scrolled ? 'top-3' : 'top-6'}`}
      >
        <div
          className="group relative flex items-center px-5 py-2.5 gap-5 rounded-full transition-all duration-300"
          style={{
            backgroundColor: 'rgba(10, 8, 12, 0.45)',
            backdropFilter: 'blur(20px) saturate(180%) contrast(120%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%) contrast(120%) brightness(1.1)',
            border: '1px solid rgba(255, 165, 80, 0.15)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(255, 165, 80, 0.1)',
          }}
        >
          {/* ── Inner Reflections ── */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none overflow-hidden opacity-50 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-70"
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
          <div className="flex items-center gap-4 z-10 ml-2">
            <Link
              href="/search"
              onClick={clearIframes}
              className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Search"
            >
              <Search size={17} strokeWidth={2} />
            </Link>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
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
          background: 'rgba(10, 8, 12, 0.45)',
          backdropFilter: 'blur(20px) saturate(180%) contrast(120%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%) contrast(120%) brightness(1.1)',
          borderTop: '1px solid rgba(255, 165, 80, 0.15)',
          boxShadow: '0 -10px 30px -10px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.2)',
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
                onClick={(e) => {
                  clearIframes();
                  if (href === '/') {
                     if (pathname === '/') {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                     }
                  }
                }}
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

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
