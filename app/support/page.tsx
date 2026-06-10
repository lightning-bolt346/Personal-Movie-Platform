'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Heart, ShieldCheck, Gem } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';

const BtcIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.892 4.531-5.606-2.083-7.539-6.307-6.22l-.946-5.362-2.122.374.939 5.318c-3.142.92-2.88 1.406-2.88 1.406l1.378 1.956.883 5.011s-.81 1.258-3.056.862l1.642 2.33 1.054 5.96 2.123-.374-1.026-5.811c3.155-.838 7.042-3.123 7.102-3.123z"/>
  </svg>
);

const EthIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M11.999 3l-6.398 10.638 6.398 3.774 6.402-3.774L11.999 3zM11.999 18.577l-6.398-8.939 6.398 11.362 6.402-11.362-6.402 8.939z"/>
  </svg>
);

const UsdtIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M8 8h8M12 8v12M12 11c-3.5 0-6-1.5-6-3.5S8.5 4 12 4s6 1.5 6 3.5S15.5 11 12 11z"/>
  </svg>
);

const UsdcIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M10.5 9.5c-.8-.5-1.5-.5-1.5.5s1 1.5 3 2 1.5 1 1.5 2-.5 1.5-1.5 1.5M9 14.5c.5.8 1.5.5 1.5-.5" />
  </svg>
);

const BnbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 2l-5 5 5 5 5-5-5-5zM6 8l-5 5 5 5 5-5-5-5zM18 8l-5 5 5 5 5-5-5-5zM12 14l-5 5 5 5 5-5-5-5z"/>
  </svg>
);

const WALLETS = [
  { id: 'usdt', label: 'USDT', network: 'Polygon', icon: <UsdtIcon />, color: '#8247E5', address: '0xba3898d8b3d232111a2193c4d330e53cf4cf38cd' },
  { id: 'usdc', label: 'USDC', network: 'Polygon', icon: <UsdcIcon />, color: '#2775CA', address: '0xba3898d8b3d232111a2193c4d330e53cf4cf38cd' },
  { id: 'eth',  label: 'ETH',  network: 'Ethereum',icon: <EthIcon />, color: '#627EEA', address: '0xba3898d8b3d232111a2193c4d330e53cf4cf38cd' },
  { id: 'btc',  label: 'BTC',  network: 'Bitcoin', icon: <BtcIcon />, color: '#F7931A', address: 'bc1q7rdc229skeumz0tfecmqnajhkw9s97ttrl0hgq' },
  { id: 'bnb',  label: 'BNB',  network: 'BNB Smart Chain', icon: <BnbIcon />, color: '#F3BA2F', address: '0xba3898d8b3d232111a2193c4d330e53cf4cf38cd' },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState(WALLETS[0].id);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasDonated, setHasDonated] = useState(false);
  
  const [showVerification, setShowVerification] = useState(false);
  const [txid, setTxid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen to global verification results to update UI status on Support page
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const verifyDataStr = localStorage.getItem('zivox_donation_verify');
        if (!verifyDataStr) {
          // If the key is deleted, it means verification failed!
          setIsSubmitting(false);
          setError('Verification failed. Please check the transaction hash and try again.');
          if ((window as any)._supportTimeoutId) {
            clearTimeout((window as any)._supportTimeoutId);
          }
          return;
        }

        const verifyData = JSON.parse(verifyDataStr);
        if (verifyData.status === 'verified') {
          if ((window as any)._supportTimeoutId) {
            clearTimeout((window as any)._supportTimeoutId);
          }
          setIsSubmitting(false);
          setHasDonated(true);
        } else if (verifyData.status === 'pending' || verifyData.status === 'verifying') {
          setIsSubmitting(true);
        }
      } catch (e) {
        setIsSubmitting(false);
      }
    };

    window.addEventListener('zivox_donation_update', handleUpdate);
    return () => window.removeEventListener('zivox_donation_update', handleUpdate);
  }, []);

  const activeWallet = WALLETS.find(w => w.id === activeTab)!;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeWallet.address);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Cinematic Ambient Background */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
        <div 
          className="absolute inset-0 opacity-40 transition-colors duration-1000 blur-[150px]"
          style={{ 
            background: `radial-gradient(circle at 50% 30%, ${activeWallet.color}40 0%, transparent 60%)` 
          }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
      </div>

      <div className="w-full max-w-5xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Content Area */}
        <div className="flex flex-col text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-6 w-fit">
            <Heart size={14} className="fill-brand-400/20" /> Support Zivox
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-tight mb-6">
            Help us keep ZIVOX <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-400">Free & Ad-Free.</span>
          </h1>
          
          <p className="text-zinc-400 text-base lg:text-lg leading-relaxed mb-8 max-w-xl">
            We built ZIVOX because we were tired of streaming sites filled with malicious redirects, pop-ups, and subscriptions. We pay for high-speed servers out of pocket to ensure you get a premium, uninterrupted cinematic experience. 
          </p>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">100% Genuine Privacy</h4>
                <p className="text-zinc-500 text-sm mt-1 leading-relaxed">No tracking scripts, no selling your data. Your watch history stays purely local to your browser.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <Gem size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Premium Experience</h4>
                <p className="text-zinc-500 text-sm mt-1 leading-relaxed">Lightning fast load times and clean UI design. We believe everyone deserves a beautifully designed entertainment hub.</p>
              </div>
            </div>
          </div>
          
          <p className="text-zinc-500 text-sm font-medium italic">
            If you appreciate what we do, any small crypto donation goes a long way in paying the monthly server bills. Thank you! 💜
          </p>
        </div>

        {/* Right Donation Card Area */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-[rgba(10,8,12,0.8)] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative"
            style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 30px 60px rgba(0,0,0,0.5)' }}
          >
            {/* Dynamic Card Glow */}
            <div 
              className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] transition-colors duration-700 opacity-20 pointer-events-none"
              style={{ backgroundColor: activeWallet.color }}
            />

            <h3 className="text-2xl font-bold font-display text-white mb-2">Donate via Crypto</h3>
            <p className="text-zinc-500 text-sm mb-6">Select your preferred coin below.</p>

            {/* Coin Tabs */}
            <AnimatePresence mode="wait">
              {!hasDonated ? (
                <motion.div
                  key="donate-ui"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {WALLETS.map(wallet => {
                      const isActive = activeTab === wallet.id;
                      return (
                        <button
                          key={wallet.id}
                          onClick={() => setActiveTab(wallet.id)}
                          className="relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shrink-0"
                          style={isActive ? { 
                            backgroundColor: wallet.color, 
                            color: '#ffffff',
                            boxShadow: `0 4px 15px ${wallet.color}40`
                          } : {}}
                        >
                          {!isActive && (
                            <div className="absolute inset-0 bg-white/5 border border-white/5 rounded-xl transition-colors hover:bg-white/10" />
                          )}
                          <span className="relative z-10">{wallet.icon}</span>
                          <span className={`relative z-10 ${!isActive ? 'text-white/60' : ''}`}>
                            {wallet.label}
                          </span>
                          {isActive && (
                            <motion.div 
                              layoutId="activePageCoin"
                              className="absolute inset-0 border border-white/20 rounded-xl"
                              transition={{ ease: "easeOut", duration: 0.3 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* QR & Details Section */}
                  <div className="bg-void-950/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center relative z-10">
                    <div className="bg-white p-4 rounded-2xl mb-5 shadow-2xl relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <QRCodeSVG 
                            value={activeWallet.address} 
                            size={200} 
                            level="H"
                            fgColor={activeWallet.color}
                            className="rounded-lg"
                          />
                        </motion.div>
                      </AnimatePresence>
                      {/* Center Logo Overlay for QR */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white p-1 rounded-full shadow-md text-black">
                           {activeWallet.icon}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center w-full">
                      <div className="inline-flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeWallet.color }} />
                        <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
                          {activeWallet.network} Network
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-500 mb-5">
                        🇮🇳 USDT/USDC → India & Global | 🇺🇸🇬🇧 USDC/ETH/BTC → USA & UK
                      </div>

                      {/* Address Box */}
                      <div className="w-full bg-black/40 rounded-xl p-4 flex items-center justify-between gap-3 border border-white/10 group hover:border-white/20 transition-colors">
                        <div className="text-sm text-zinc-400 font-mono truncate flex-1 select-all text-left">
                          {activeWallet.address}
                        </div>
                        <button
                          onClick={handleCopy}
                          className="shrink-0 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors relative"
                          style={{ color: activeWallet.color }}
                          title="Copy Address"
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!showVerification ? (
                      <motion.button
                        key="btn-init"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onClick={() => setShowVerification(true)}
                        className="mt-6 w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 border"
                        style={{
                          background: `linear-gradient(to right, ${activeWallet.color}15, ${activeWallet.color}25)`,
                          borderColor: `${activeWallet.color}30`,
                          color: activeWallet.color
                        }}
                      >
                        <Heart size={16} className="fill-current" /> I have completed my donation
                      </motion.button>
                    ) : (
                      <motion.form
                        key="form-verify"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!txid.trim()) return;
                          setIsSubmitting(true);
                          setError(null);
                          
                          const verifyData = {
                            txid: txid.trim(),
                            coin: activeTab,
                            status: 'pending',
                            timestamp: Date.now()
                          };
                          localStorage.setItem('zivox_donation_verify', JSON.stringify(verifyData));

                          // Trigger global verification immediately
                          window.dispatchEvent(new Event('zivox_donation_update'));
                          
                          // If it takes longer than 10 seconds, fallback to granting temporary access
                          const timeoutId = setTimeout(() => {
                            try {
                              const currentData = localStorage.getItem('zivox_donation_verify');
                              if (currentData) {
                                const data = JSON.parse(currentData);
                                if (data.status !== 'verified') {
                                  const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
                                  localStorage.setItem('has_supported_zivox', expiry.toString());
                                  setIsSubmitting(false);
                                  setHasDonated(true);
                                }
                              }
                            } catch (err) {
                              setIsSubmitting(false);
                            }
                          }, 10000);

                          (window as any)._supportTimeoutId = timeoutId;
                        }}
                        className="mt-6 flex flex-col gap-3"
                      >
                        <input
                          type="text"
                          placeholder="Paste Transaction Hash (TxID)"
                          value={txid}
                          onChange={(e) => setTxid(e.target.value)}
                          required
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                        />
                        {error && (
                          <p className="text-xs text-red-400 font-bold text-center mt-1">
                            {error}
                          </p>
                        )}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 rounded-xl font-bold tracking-widest text-xs uppercase transition-all flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-black disabled:opacity-50"
                        >
                          {isSubmitting ? 'Verifying...' : 'Submit TxID & Verify'}
                        </button>
                        <p className="text-[10px] text-white/40 text-center mt-2 leading-relaxed">
                          We verify transactions via blockchain RPCs to unlock 1 month of premium. <br/>
                          <span className="text-brand-500 font-bold">Already donated on another device within the last 30 days?</span> Paste that TxID here to sync your premium access!
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="thank-you"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 relative">
                    <Heart size={40} className="text-emerald-500 fill-emerald-500" />
                    <motion.div 
                      className="absolute inset-0 rounded-full border border-emerald-500"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  <h3 className="text-3xl font-display font-black text-white mb-4 leading-tight">
                    You're Amazing!
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm">
                    Thank you from the bottom of our hearts. Your generosity directly pays for the high-speed servers that keep ZIVOX ad-free and lightning fast for everyone. <br/><br/> Enjoy the cinematic experience!
                  </p>

                  <Link 
                    href="/"
                    className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-xs transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    Return to Home
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Global Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-white/10 px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 z-[9999]"
          >
            <Check size={16} className="text-emerald-400" />
            <span className="text-sm font-bold text-white tracking-wide">Wallet Address Copied!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
