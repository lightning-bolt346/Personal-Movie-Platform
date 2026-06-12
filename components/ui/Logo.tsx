import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: (e: React.MouseEvent<any>) => void;
  href?: string;
}

export function Logo({ className = '', size = 'md', onClick, href = '/' }: LogoProps) {
  const sizes = {
    sm: { 
      text: 'text-[16px]', 
      ring: 'w-[16px] h-[16px] border-[2px]', 
      play: 'border-l-[5px] border-y-[3.5px]',
      tvText: 'text-[10px]', 
      tvPad: 'px-[4px] py-[2px] ml-[2px]' 
    },
    md: { 
      text: 'text-[18px]', 
      ring: 'w-[18px] h-[18px] border-[2px]', 
      play: 'border-l-[6px] border-y-[4px]',
      tvText: 'text-[11px]', 
      tvPad: 'px-[5px] py-[2px] ml-[3px]' 
    },
    lg: { 
      text: 'text-[26px]', 
      ring: 'w-[26px] h-[26px] border-[2.5px]', 
      play: 'border-l-[8px] border-y-[5.5px]',
      tvText: 'text-[13px]', 
      tvPad: 'px-[6px] py-[3px] ml-[4px]' 
    },
    xl: { 
      text: 'text-[42px]', 
      ring: 'w-[42px] h-[42px] border-[4px]', 
      play: 'border-l-[14px] border-y-[9px]',
      tvText: 'text-[18px]', 
      tvPad: 'px-[8px] py-[4px] ml-[6px]' 
    },
  };

  const s = sizes[size];

  return (
    <Link href={href} onClick={onClick} className={`inline-flex items-center select-none group ${className}`} aria-label="ZivoxTV Home">
      {/* ZIV */}
      <span
        className={`font-display font-black tracking-[-0.05em] leading-none ${s.text} transition-all duration-300 group-hover:text-white`}
        style={{
          background: 'linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.7) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        ZIV
      </span>

      {/* The Cinematic 'O' Ring */}
      <span
        className={`relative inline-flex items-center justify-center rounded-full mx-[2px] transition-all duration-500 group-hover:scale-110 group-hover:rotate-90 group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--brand-500)_60%,transparent)] ${s.ring}`}
        style={{
          borderStyle: 'solid',
          borderColor: 'var(--brand-500)',
          boxShadow: '0 0 10px color-mix(in srgb, var(--brand-500) 40%, transparent), inset 0 0 5px color-mix(in srgb, var(--brand-500) 20%, transparent)',
        }}
      >
        {/* Play triangle inside the 'O' */}
        <span 
          className={`w-0 h-0 ml-[10%] border-t-transparent border-b-transparent border-l-brand-400 opacity-90 transition-all duration-300 group-hover:scale-90 ${s.play}`} 
          style={{
            filter: 'drop-shadow(0 0 4px var(--brand-500))'
          }}
        />
      </span>

      {/* X */}
      <span
        className={`font-display font-black tracking-[-0.05em] leading-none ${s.text} transition-all duration-300 group-hover:text-white`}
        style={{
          background: 'linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.7) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        X
      </span>

      {/* TV Badge */}
      <span
        className={`font-display font-black leading-none bg-void-900 border border-white/10 rounded overflow-hidden relative flex items-center justify-center transition-all duration-500 group-hover:border-brand-500/50 group-hover:shadow-[0_0_15px_color-mix(in_srgb,var(--brand-500)_30%,transparent)] ${s.tvPad} ${s.tvText}`}
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,25,0.8), rgba(10,10,15,0.8))',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Shine effect inside badge */}
        <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-[1.5s] ease-in-out pointer-events-none" />
        
        <span
          style={{
            background: 'linear-gradient(135deg, var(--brand-400) 0%, var(--brand-600) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.02em',
          }}
        >
          TV
        </span>
      </span>
    </Link>
  );
}
