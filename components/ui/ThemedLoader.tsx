'use client';
import { motion } from 'motion/react';
import { Hexagon, Film, Tv, Sparkles } from 'lucide-react';

export type LoaderTheme = 'home' | 'anime' | 'movies' | 'tv';

export function ThemedLoader({ theme = 'home' }: { theme?: LoaderTheme }) {
  
  if (theme === 'anime') {
    return (
      <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0014] w-screen h-screen overflow-hidden">
        {/* Neon Pink/Purple Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-fuchsia-600/10 blur-[120px] rounded-full" />
        
        {/* Enhanced 3D Sakura Petals */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
           <div className="w-3 h-5 bg-pink-300 absolute top-[-10%] left-[20%] animate-[slide-down-right_3s_linear_infinite]" style={{ borderRadius: '50% 0 50% 50%', transform: 'rotate(45deg)' }} />
           <div className="w-4 h-6 bg-fuchsia-400 absolute top-[-5%] left-[60%] animate-[slide-down-right_4s_linear_infinite_0.5s]" style={{ borderRadius: '50% 0 50% 50%', transform: 'rotate(70deg)' }} />
           <div className="w-2 h-4 bg-pink-200 absolute top-[10%] left-[80%] animate-[slide-down-right_2.5s_linear_infinite_1s]" style={{ borderRadius: '50% 0 50% 50%', transform: 'rotate(30deg)' }} />
           <div className="w-5 h-7 bg-pink-400 absolute top-[-20%] left-[40%] animate-[slide-down-right_5s_linear_infinite_1.5s]" style={{ borderRadius: '50% 0 50% 50%', transform: 'rotate(120deg)' }} />
           <div className="w-3 h-5 bg-fuchsia-300 absolute top-[20%] left-[-10%] animate-[slide-down-right_3.5s_linear_infinite_0.2s]" style={{ borderRadius: '50% 0 50% 50%', transform: 'rotate(80deg)' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative mb-6 w-full flex justify-center">
            {/* Unfilled Base */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-fuchsia-950/30 uppercase pl-[0.4em] opacity-0">
              ZIVOX
            </h1>

            {/* Top Half */}
            <motion.h1 
              className="absolute top-0 left-0 w-full text-center text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-transparent uppercase bg-clip-text pl-[0.4em]"
              style={{ backgroundImage: 'linear-gradient(to right, #d946ef, #ec4899)' }}
              initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 48%, 0 52%)', scale: 0.95, filter: 'blur(4px)' }}
              animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 48%, 0 52%)', scale: 1, filter: 'blur(0px)', x: -8, y: -4 }}
              transition={{ duration: 1.0, ease: "easeOut", x: { delay: 1.0, duration: 0.3, type: "spring", stiffness: 400, damping: 15 }, y: { delay: 1.0, duration: 0.2, ease: "easeOut" } }}
            >
              ZIVOX
            </motion.h1>
            
            {/* Bottom Half */}
            <motion.h1 
              className="absolute top-0 left-0 w-full text-center text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-transparent uppercase bg-clip-text pl-[0.4em]"
              style={{ backgroundImage: 'linear-gradient(to right, #d946ef, #ec4899)' }}
              initial={{ clipPath: 'polygon(0 52%, 100% 48%, 100% 100%, 0 100%)', scale: 0.95, filter: 'blur(4px)' }}
              animate={{ clipPath: 'polygon(0 52%, 100% 48%, 100% 100%, 0 100%)', scale: 1, filter: 'blur(0px)', x: 8, y: 4 }}
              transition={{ duration: 1.0, ease: "easeOut", x: { delay: 1.0, duration: 0.3, type: "spring", stiffness: 400, damping: 15 }, y: { delay: 1.0, duration: 0.2, ease: "easeOut" } }}
            >
              ZIVOX
            </motion.h1>

            {/* Katana Slash line */}
            <motion.div 
               className="absolute top-[48%] left-[-20%] w-[140%] h-[3px] bg-white shadow-[0_0_20px_#fff,0_0_40px_#d946ef]"
               initial={{ scaleX: 0, opacity: 1, rotate: -3 }}
               animate={{ scaleX: 1, opacity: 0, rotate: -3 }}
               transition={{ duration: 0.4, ease: "circOut", delay: 0.9 }}
               style={{ originX: 0, originY: 0.5 }}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-fuchsia-500 animate-pulse" />
            <div className="font-mono text-xs text-fuchsia-400 tracking-[0.3em] uppercase">Anime World</div>
            <motion.div 
              className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-[2px] bg-fuchsia-500 rounded-full"
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
        {/* Deep Gold/Amber Ambient Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-amber-500/10 blur-[150px] rounded-full" />
        
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
          <div className="relative overflow-hidden mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-amber-950/50 uppercase pl-[0.4em]">
              ZIVOX
            </h1>
            <motion.h1 
              className="absolute top-0 left-0 text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-transparent uppercase bg-clip-text pl-[0.4em]"
              style={{ backgroundImage: 'linear-gradient(to right, #fbbf24, #f59e0b)' }}
              initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.8 }}
              animate={{ clipPath: 'inset(0 0% 0 0)', opacity: [0.8, 1, 0.5, 1, 0.9, 1] }}
              transition={{ 
                clipPath: { duration: 1.2, ease: [0.85, 0, 0.15, 1] },
                opacity: { duration: 2, repeat: Infinity, ease: "linear" } 
              }}
            >
              ZIVOX
            </motion.h1>
          </div>
          
          <div className="flex items-center gap-3 text-amber-500">
            <Film className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
            <div className="font-mono text-xs tracking-[0.3em] uppercase">Cinema</div>
            <motion.div 
              className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-[2px] bg-amber-500 rounded-full"
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
      <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#02050a] w-screen h-screen overflow-hidden">
        {/* Retro CRT Scanlines & Static */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiAvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiAvPgo8L3N2Zz4=')] animate-[slide-down_20s_linear_infinite]" />
        
        {/* REC Indicator */}
        <div className="absolute top-8 left-8 flex items-center gap-2 font-mono text-xl text-brand- tracking-widest font-bold">
           <div className="w-4 h-4 bg-brand- rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
           REC
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative mb-6 w-full flex justify-center h-20 items-center">
            {/* Unfilled Base for layout spacing */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-cyan-950/0 uppercase pl-[0.4em]">
              ZIVOX
            </h1>

            {/* Heavy Glitch Slices */}
            {[...Array(5)].map((_, i) => (
              <motion.h1 
                key={`glitch-${i}`}
                className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-center text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-white uppercase pl-[0.4em] mix-blend-screen"
                initial={{ clipPath: `inset(${i * 20}% 0 ${100 - (i + 1) * 20}% 0)` }}
                animate={{ 
                   x: [0, (i % 2 === 0 ? 1 : -1) * (15 + Math.random() * 15), 0, (i % 2 === 0 ? -1 : 1) * (10 + Math.random() * 10), 0],
                   filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(-90deg)', 'hue-rotate(180deg)', 'hue-rotate(0deg)']
                }}
                transition={{ duration: 0.8 + Math.random() * 0.4, ease: "linear", repeat: Infinity, repeatType: "mirror", delay: Math.random() * 0.3 }}
              >
                ZIVOX
              </motion.h1>
            ))}
            
            {/* Chromatic Aberration Shadows */}
            <motion.h1 
              className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-center text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-cyan-500 uppercase pl-[0.4em] mix-blend-screen opacity-70"
              animate={{ x: [0, -6, 3, -4, 0], opacity: [0.7, 1, 0.4, 0.9, 0.7] }}
              transition={{ duration: 0.25, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
            >
              ZIVOX
            </motion.h1>
            <motion.h1 
              className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-center text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-fuchsia-500 uppercase pl-[0.4em] mix-blend-screen opacity-70"
              animate={{ x: [0, 6, -3, 4, 0], opacity: [0.7, 0.4, 1, 0.6, 0.7] }}
              transition={{ duration: 0.3, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
            >
              ZIVOX
            </motion.h1>
          </div>
          
          <div className="flex items-center gap-3 text-cyan-400 mt-2">
            <Tv className="w-5 h-5 animate-pulse" />
            <div className="font-mono text-xs tracking-[0.3em] uppercase">Broadcast</div>
            <motion.div 
              className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-[2px] bg-cyan-500 rounded-full"
              initial={{ width: "0px" }}
              animate={{ width: "120px" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT / HOME THEME
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050505] w-screen h-screen overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-brand-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative overflow-hidden mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-void-800/50 uppercase pl-[0.4em]">
            ZIVOX
          </h1>
          <motion.h1 
            className="absolute top-0 left-0 text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[0.4em] text-transparent uppercase bg-clip-text pl-[0.4em]"
            style={{ backgroundImage: 'linear-gradient(to right, rgb(var(--brand-500)), rgb(var(--brand-400)))' }}
            initial={{ clipPath: 'inset(0 100% 0 0)', scale: 0.95, opacity: 0 }}
            animate={{ clipPath: 'inset(0 0% 0 0)', scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
          >
            ZIVOX
          </motion.h1>
        </div>

        <div className="w-16 md:w-24 h-[2px] bg-void-800 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-brand-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}
