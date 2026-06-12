'use client';
import { motion } from 'motion/react';
import { Hexagon, Film, Tv, Sparkles } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export type LoaderTheme = 'home' | 'anime' | 'movies' | 'tv';

export function ThemedLoader({ theme = 'home' }: { theme?: LoaderTheme }) {
  
  if (theme === 'anime') {
    return (
      <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0014] w-screen h-screen overflow-hidden">
        {/* Theme Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-brand-500/10 blur-[120px] rounded-full" />
        
        {/* Enhanced 3D Sakura Petals (Themed) */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
           <div className="w-3 h-5 bg-white/40 absolute top-[-10%] left-[20%] animate-[slide-down-right_3s_linear_infinite]" style={{ borderRadius: '50% 0 50% 50%', transform: 'rotate(45deg)', boxShadow: '0 0 10px var(--brand-500)' }} />
           <div className="w-4 h-6 bg-brand-400 absolute top-[-5%] left-[60%] animate-[slide-down-right_4s_linear_infinite_0.5s]" style={{ borderRadius: '50% 0 50% 50%', transform: 'rotate(70deg)' }} />
           <div className="w-2 h-4 bg-brand-300 absolute top-[10%] left-[80%] animate-[slide-down-right_2.5s_linear_infinite_1s]" style={{ borderRadius: '50% 0 50% 50%', transform: 'rotate(30deg)' }} />
           <div className="w-5 h-7 bg-premium-gradient absolute top-[-20%] left-[40%] animate-[slide-down-right_5s_linear_infinite_1.5s]" style={{ borderRadius: '50% 0 50% 50%', transform: 'rotate(120deg)' }} />
           <div className="w-3 h-5 bg-white/30 absolute top-[20%] left-[-10%] animate-[slide-down-right_3.5s_linear_infinite_0.2s]" style={{ borderRadius: '50% 0 50% 50%', transform: 'rotate(80deg)', boxShadow: '0 0 10px var(--brand-400)' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative mb-6 w-full flex justify-center">
            {/* Unfilled Base */}
            <div className="opacity-0 pb-2"><Logo size="xl" /></div>

            {/* Top Half */}
            <motion.div 
              className="absolute top-0 left-0 w-full flex justify-center pb-2"
              initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 48%, 0 52%)', scale: 0.95, filter: 'blur(4px)' }}
              animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 48%, 0 52%)', scale: 1, filter: 'blur(0px)', x: -8, y: -4 }}
              transition={{ duration: 1.0, ease: "easeOut", x: { delay: 1.0, duration: 0.3, type: "spring", stiffness: 400, damping: 15 }, y: { delay: 1.0, duration: 0.2, ease: "easeOut" } }}
            >
              <Logo size="xl" className="pointer-events-none" />
            </motion.div>
            
            {/* Bottom Half */}
            <motion.div 
              className="absolute top-0 left-0 w-full flex justify-center pb-2"
              initial={{ clipPath: 'polygon(0 52%, 100% 48%, 100% 100%, 0 100%)', scale: 0.95, filter: 'blur(4px)' }}
              animate={{ clipPath: 'polygon(0 52%, 100% 48%, 100% 100%, 0 100%)', scale: 1, filter: 'blur(0px)', x: 8, y: 4 }}
              transition={{ duration: 1.0, ease: "easeOut", x: { delay: 1.0, duration: 0.3, type: "spring", stiffness: 400, damping: 15 }, y: { delay: 1.0, duration: 0.2, ease: "easeOut" } }}
            >
              <Logo size="xl" className="pointer-events-none" />
            </motion.div>

            {/* Katana Slash line */}
            <motion.div 
               className="absolute top-[48%] left-[-20%] w-[140%] h-[3px] bg-white"
               initial={{ scaleX: 0, opacity: 1, rotate: -3 }}
               animate={{ scaleX: 1, opacity: 0, rotate: -3 }}
               transition={{ duration: 0.4, ease: "circOut", delay: 0.9 }}
               style={{ originX: 0, originY: 0.5, boxShadow: '0 0 20px #fff, 0 0 40px var(--brand-500)' }}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-brand-500 animate-pulse" />
            <div className="font-mono text-xs text-brand-400 tracking-[0.3em] uppercase">Anime World</div>
            <motion.div 
              className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-[2px] bg-premium-gradient rounded-full"
              initial={{ width: "0px" }}
              animate={{ width: "120px" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (theme === 'movies') {
    return (
      <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050300] w-screen h-screen overflow-hidden">
        {/* Ambient Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand-500/10 blur-[150px] rounded-full" />
        
        {/* Cinematic Letterboxes opening */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-[15vh] bg-black z-20"
          initial={{ y: 0 }} animate={{ y: "-100%" }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-[15vh] bg-black z-20"
          initial={{ y: 0 }} animate={{ y: "100%" }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative overflow-hidden mb-6 flex justify-center">
            <div className="opacity-20 grayscale brightness-50"><Logo size="xl" className="pointer-events-none" /></div>
            <motion.div 
              className="absolute top-0 left-0 w-full flex justify-center"
              initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.8 }}
              animate={{ clipPath: 'inset(0 0% 0 0)', opacity: [0.8, 1, 0.5, 1, 0.9, 1] }}
              transition={{ 
                clipPath: { duration: 1.2, ease: [0.85, 0, 0.15, 1] },
                opacity: { duration: 2, repeat: Infinity, ease: "linear" } 
              }}
            >
              <Logo size="xl" className="pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            </motion.div>
          </div>
          
          <div className="flex items-center gap-3 text-brand-500">
            <Film className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
            <div className="font-mono text-xs tracking-[0.3em] uppercase">Cinema</div>
            <motion.div 
              className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-[2px] bg-premium-gradient rounded-full"
              initial={{ width: "0px" }}
              animate={{ width: "120px" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (theme === 'tv') {
    return (
      <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050508] w-screen h-screen overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Cinematic Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative overflow-hidden mb-8 flex justify-center py-2 px-6">
            <div className="opacity-10"><Logo size="xl" className="pointer-events-none" /></div>
            
            {/* The actual Logo fading in and floating up slightly */}
            <motion.div 
              className="absolute inset-0 flex justify-center items-center"
              initial={{ y: 15, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Logo size="xl" className="pointer-events-none drop-shadow-[0_0_20px_color-mix(in_srgb,var(--brand-500)_50%,transparent)]" />
            </motion.div>

            {/* A glass-like reflection sweep over the logo */}
            <motion.div
              className="absolute inset-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
            />
          </div>
          
          <motion.div 
            className="flex items-center gap-3 text-brand-400 mt-2 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tv className="w-5 h-5" />
            <div className="font-mono text-xs tracking-[0.3em] uppercase">Series</div>
            <motion.div 
              className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-[2px] bg-premium-gradient rounded-full"
              initial={{ width: "0px" }}
              animate={{ width: "120px" }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  // DEFAULT / HOME THEME
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050505] w-screen h-screen overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-brand-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative overflow-hidden mb-8 flex justify-center">
          <div className="opacity-20 grayscale brightness-50"><Logo size="xl" /></div>
          <motion.div 
            className="absolute top-0 left-0 w-full flex justify-center"
            initial={{ clipPath: 'inset(0 100% 0 0)', scale: 0.95, opacity: 0 }}
            animate={{ clipPath: 'inset(0 0% 0 0)', scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
          >
            <Logo size="xl" className="pointer-events-none" />
          </motion.div>
        </div>

        <div className="w-16 md:w-24 h-[2px] bg-void-800 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-premium-gradient rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}
