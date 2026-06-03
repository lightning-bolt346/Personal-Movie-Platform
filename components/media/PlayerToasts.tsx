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
  const prevServerName = useRef(serverName);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial mounting toasts (Staggered & StrictMode safe)
  useEffect(() => {
    if (initialToastsTriggered.current) return;
    initialToastsTriggered.current = true;

    const messages = [
      {
        id: 'toast-1',
        icon: 'info' as const,
        message: 'Some servers may trigger popups or redirects. These are from 3rd-party sources, not ZIVOX.'
      },
      {
        id: 'toast-2',
        icon: 'alert' as const,
        message: 'Sandbox mode protects you, but some sources might not load. Try disabling Sandbox if a video fails.'
      },
      {
        id: 'toast-3',
        icon: 'info' as const,
        message: 'Sorry for any inconvenience! Try switching servers if one is too slow or has too many ads.'
      }
    ];

    const timeouts = messages.map((msg, idx) => {
      return setTimeout(() => {
        setToasts((prev) => {
          if (prev.some((t) => t.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }, 500 + idx * 1500); // Appear at 0.5s, 2.0s, 3.5s
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Watch for Server Name changes
  useEffect(() => {
    if (prevServerName.current && serverName && prevServerName.current !== serverName) {
      const serverToast = {
        id: `server-${Date.now()}`,
        icon: 'server' as const,
        message: `Switched to ${serverName} server.`
      };
      setToasts((prev) => [...prev, serverToast]);
    }
    prevServerName.current = serverName;
  }, [serverName]);

  // Toast expiry logic (individual timers)
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 8000); // 8 seconds per toast
    });
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed top-24 right-4 md:right-8 md:top-28 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            layout
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="backdrop-blur-xl border rounded-xl p-4 shadow-2xl flex items-start gap-3 pointer-events-auto relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(5, 5, 5, 0.85)',
              borderColor: 'color-mix(in srgb, var(--ambient-color, rgba(255,255,255,0.1)) 40%, transparent)',
              boxShadow: '0 10px 40px -10px color-mix(in srgb, var(--ambient-color, rgba(0,0,0,0.5)) 20%, transparent)'
            }}
          >
            {/* Ambient Background Glow inside the toast */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ background: 'var(--ambient-color)' }}
            />
            
            <div className={`mt-0.5 shrink-0 relative z-10 ${
              toast.icon === 'alert' ? 'text-amber-400' : 
              toast.icon === 'server' ? 'text-emerald-400' : 'text-blue-400'
            }`}>
              {toast.icon === 'alert' ? <AlertCircle size={20} /> : 
               toast.icon === 'server' ? <Server size={20} /> : <Info size={20} />}
            </div>
            
            <p className="text-sm text-white/90 leading-snug flex-1 relative z-10 font-medium">
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white transition-colors shrink-0 -mt-1 -mr-1 p-1 relative z-10"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
