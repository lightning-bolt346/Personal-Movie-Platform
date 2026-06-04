'use client';
import { motion } from 'motion/react';

const MOODS = [
  { emoji: '😂', label: 'Need a Laugh', genreId: 35, color: 'from-amber-500/20 to-orange-600/20', border: 'border-amber-500/30' },
  { emoji: '😱', label: 'Terrify Me', genreId: 27, color: 'from-red-900/40 to-black', border: 'border-red-900/50' },
  { emoji: '😭', label: 'Make Me Cry', genreId: 18, color: 'from-blue-600/20 to-indigo-900/20', border: 'border-blue-500/30' },
  { emoji: '🤯', label: 'Mind-Bending', genreId: 878, color: 'from-purple-600/20 to-fuchsia-900/20', border: 'border-purple-500/30' },
  { emoji: '❤️', label: 'Romantic', genreId: 10749, color: 'from-pink-500/20 to-rose-700/20', border: 'border-pink-500/30' },
  { emoji: '⚔️', label: 'Adrenaline', genreId: 28, color: 'from-crimson-600/20 to-red-900/20', border: 'border-crimson-500/30' },
];

export function MoodBoard({ onSelectMood }: { onSelectMood: (genreId: number) => void }) {
  return (
    <div className="mb-10 relative z-20">
      <h3 className="text-white/80 font-bold mb-4 text-sm tracking-wider uppercase">Pick a Mood</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectMood(mood.genreId)}
            className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl border bg-gradient-to-br ${mood.color} ${mood.border} hover:bg-white/5 transition-colors shadow-lg`}
          >
            <span className="text-3xl drop-shadow-md">{mood.emoji}</span>
            <span className="text-white font-bold text-xs tracking-wide text-center drop-shadow-md">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
