'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, AlertCircle, Server } from 'lucide-react';

interface ToastData {
  id: string;
  message: string;
  icon: 'info' | 'alert' | 'server';
}

interface PlayerToastsProps {
  serverName?: string;
}

export function PlayerToasts({ serverName }: PlayerToastsProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);
  const initialToastsTriggered = useRef(false);
  const prevServerName = useRef<string | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fire initial toasts only AFTER portal is ready (mounted=true)
  useEffect(() => {
    if (!mounted) return;
    if (initialToastsTriggered.current) return;
    initialToastsTriggered.current = true;

    // Set initial prevServerName without triggering server switch toast
    prevServerName.current = serverName;

    const messages: ToastData[] = [
      {
        id: `init-1-${Date.now()}`,
        icon: 'info',
        message: 'Some servers may trigger redirects from 3rd-party sources — not from ZIVOX. Sandbox Shield protects you!'
      },
      {
        id: `init-2-${Date.now() + 1}`,
        icon: 'alert',
        message: 'If a video fails to load, try disabling Sandbox mode in the Settings. Some sources require it off.'
      },
      {
        id: `init-3-${Date.now() + 2}`,
        icon: 'info',
        message: 'Slow stream? Switch servers anytime — we have 20+ sources to choose from!'
      }
    ];

    const timeouts = messages.map((msg, idx) =>
      setTimeout(() => {
        setToasts(prev => {
          if (prev.some(t => t.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }, 800 + idx * 2000) // 0.8s, 2.8s, 4.8s
    );

    return () => timeouts.forEach(clearTimeout);
  }, [mounted, serverName]);

  // Watch for Server Name changes (skip the very first assignment)
  useEffect(() => {
    if (!mounted) return;
    if (!initialToastsTriggered.current) return;
    if (prevServerName.current === undefined) {
      prevServerName.current = serverName;
      return;
    }
    if (prevServerName.current && serverName && prevServerName.current !== serverName) {
      const serverToast: ToastData = {
        id: `server-${Date.now()}`,
        icon: 'server',
        message: `Switched to ${serverName} server.`
      };
      setToasts(prev => [...prev, serverToast]);
    }
    prevServerName.current = serverName;
  }, [serverName, mounted]);

  // Per-toast 8s expiry using stable individual timers
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map(toast =>
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 8000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-24 right-4 md:right-8 md:top-28 z-[9999] flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <motion.div
            layout
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="backdrop-blur-xl border rounded-2xl p-4 shadow-2xl flex items-start gap-3 pointer-events-auto relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(8, 8, 10, 0.92)',
              borderColor: 'color-mix(in srgb, var(--ambient-color, rgba(255,255,255,0.15)) 35%, rgba(255,255,255,0.08))',
              boxShadow: '0 8px 32px -8px color-mix(in srgb, var(--ambient-color, rgba(0,0,0,0.8)) 25%, rgba(0,0,0,0.6))'
            }}
          >
            {/* Ambient glow layer */}
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none rounded-2xl"
              style={{ background: 'radial-gradient(ellipse at top left, var(--ambient-color, transparent), transparent 70%)' }}
            />

            <div className={`mt-0.5 shrink-0 relative z-10 ${
              toast.icon === 'alert' ? 'text-amber-400' :
              toast.icon === 'server' ? 'text-emerald-400' : 'text-sky-400'
            }`}>
              {toast.icon === 'alert' ? <AlertCircle size={18} /> :
               toast.icon === 'server' ? <Server size={18} /> : <Info size={18} />}
            </div>

            <p className="text-[13px] text-white/85 leading-snug flex-1 relative z-10 font-medium pr-1">
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/30 hover:text-white/70 transition-colors shrink-0 p-0.5 relative z-10 mt-0.5"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
