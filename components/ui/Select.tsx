'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  label: string;
  value: string | number;
  description?: string;
}

interface SelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ value, onChange, options, placeholder = 'Select...' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-void-950 border border-zinc-800 rounded-xl px-4 py-3 font-semibold text-sm hover:border-zinc-600 transition-colors shadow-lg active:scale-[0.98]"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div data-lenis-prevent="true" className="absolute top-full left-0 right-0 mt-2 bg-void-950 border border-zinc-800 rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto shadow-2xl origin-top animate-in fade-in zoom-in-95 duration-200">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${
                value === opt.value ? 'text-cyan-400 font-semibold' : 'text-zinc-300'
              }`}
            >
              {opt.label}
              {opt.description && (
                <span className="text-zinc-600 ml-2 text-xs font-normal">{opt.description}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
