import Link from 'next/link';
import { Film, Tv, Zap, Github, Twitter } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
  { label: 'TV Shows', href: '/tv' },
  { label: 'Anime', href: '/anime' },
  { label: 'Discover', href: '/discover' },
  { label: 'Search', href: '/search' },
  { label: 'About', href: '/about' },
  { label: 'Profile', href: '/profile' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'DMCA', href: '#' },
  { label: 'Contact', href: '#' },
];

export function Footer() {
  return (
    <footer
      className="relative z-20 mt-auto overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(5,5,5,0.97) 20%, #050505)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Crimson glow line at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(229,9,20,0.5), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-14 pt-12 pb-28 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex items-baseline gap-0 select-none">
              <span
                className="font-display font-black tracking-[-0.05em] text-[26px] leading-none"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.65) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ZIV
              </span>
              <span
                className="font-display font-black text-[26px] leading-none mx-[2px]"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: '2.5px solid rgba(229, 9, 20, 0.9)',
                  boxShadow: '0 0 12px rgba(229,9,20,0.5), inset 0 0 6px rgba(229,9,20,0.15)',
                  WebkitTextFillColor: 'transparent',
                  flexShrink: 0,
                }}
              >
              </span>
              <span
                className="font-display font-black tracking-[-0.05em] text-[26px] leading-none"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.65) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                X
              </span>
            </Link>
            <p className="text-sm text-white/35 leading-relaxed max-w-xs">
              Premium cinematic streaming experience. Discover, watch, and enjoy
              thousands of movies and TV shows — all in one place.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-1">
              {[
                { Icon: Github, href: '#', label: 'GitHub' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Icon size={15} className="text-white/50 hover:text-white" />
                </a>
              ))}
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(88,101,242,0.15)',
                  border: '1px solid rgba(88,101,242,0.25)',
                }}
              >
                <svg className="w-4 h-4 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-4">
              Navigate
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/45 hover:text-white/90 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Attribution & Status */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-4">
              Powered By
            </h3>
            <div className="flex flex-col gap-3">
              {/* TMDB */}
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-fit"
                style={{
                  background: 'rgba(1,180,228,0.08)',
                  border: '1px solid rgba(1,180,228,0.15)',
                }}
              >
                <Film size={14} className="text-[#01b4e4]" />
                <span className="text-xs font-semibold text-white/60">
                  TMDB API
                </span>
              </div>
              {/* Streams */}
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-fit"
                style={{
                  background: 'rgba(229,9,20,0.08)',
                  border: '1px solid rgba(229,9,20,0.15)',
                }}
              >
                <Zap size={14} className="text-crimson-500" />
                <span className="text-xs font-semibold text-white/60">
                  CineSrc Streams
                </span>
              </div>
              {/* Status */}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-2 h-2 rounded-full bg-green-500"
                  style={{ boxShadow: '0 0 6px rgba(34,197,94,0.7)' }}
                />
                <span className="text-xs font-mono text-green-500/70">
                  All systems operational
                </span>
              </div>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-6">
              {LEGAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-[11px] text-white/25 hover:text-white/50 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-[11px] font-mono text-white/20 tracking-wider">
            © {new Date().getFullYear()} ZIVOX. For educational purposes only.
          </p>
          <p className="text-[11px] font-mono text-white/15 tracking-wider">
            This product uses the TMDB API but is not endorsed by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
