'use client';
import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const REGIONS = [
  { code: 'US', label: 'US' },
  { code: 'IN', label: 'India' },
  { code: 'GB', label: 'UK' },
  { code: 'JP', label: 'Japan' },
  { code: 'KR', label: 'Korea' },
  { code: 'AU', label: 'Australia' }
];

export function RegionSelector() {
  const [selected, setSelected] = useState('US');

  useEffect(() => {
    const saved = localStorage.getItem('zivox_region');
    if (saved) {
      setSelected(saved);
    }
  }, []);

  const handleSelect = (code: string) => {
    setSelected(code);
    localStorage.setItem('zivox_region', code);
    window.dispatchEvent(new Event('region_changed'));
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-white/5">
        <Globe size={14} />
        <span className="text-xs font-medium uppercase tracking-wider">Region</span>
      </div>
      <div className="flex bg-zinc-900/50 p-1 rounded-full border border-white/5 overflow-x-auto no-scrollbar">
        {REGIONS.map((r) => (
          <button
            key={r.code}
            onClick={() => handleSelect(r.code)}
            className={
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap " +
              (selected === r.code 
                ? "bg-white text-black" 
                : "text-zinc-400 hover:text-white hover:bg-white/5")
            }
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
