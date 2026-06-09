'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const MOODS = [
  { label: 'Need a Laugh', slug: 'need-a-laugh', genreId: 35, image: '/lgotja3xMoJZbynwHfcQcJAEMWH.jpg', color: '#f59e0b' },
  { label: 'Terrify Me', slug: 'terrify-me', genreId: 27, image: '/vh7np635kDIcfO6x2Y9ElgLJsuI.jpg', color: '#7c3aed' },
  { label: 'Make Me Cry', slug: 'make-me-cry', genreId: 18, image: '/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg', color: '#ec4899' },
  { label: 'Mind-Bending', slug: 'mind-bending', genreId: 878, image: '/2I1OFQJ0L9T0dpU6FobKFWV2PxX.jpg', color: '#06b6d4' },
  { label: 'Romantic', slug: 'romantic', genreId: 10749, image: '/xnHVX37XZEp33hhCbYlQFq7ux1J.jpg', color: '#e50914' },
  { label: 'Adrenaline', slug: 'adrenaline', genreId: 28, image: '/6zg7A9ICOthNR2TSXlT51KvXrsA.jpg', color: '#ef4444' },
];

export function MoodBoard() {
  return (
    <div className="mb-10 relative z-20">
      <h3 className="text-white/80 font-bold mb-4 text-xs tracking-widest uppercase">Pick a Mood</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {MOODS.map((mood) => (
          <Link href={`/mood/${mood.slug}`} key={mood.label} className="contents">
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex flex-col items-center justify-center rounded-2xl overflow-hidden border border-white/[0.05] hover:border-white/20 transition-all duration-300 shadow-lg"
            style={{
              minHeight: '80px',
            }}
          >
            {/* Backdrop Image */}
            <Image
              src={`https://image.tmdb.org/t/p/w500${mood.image}`}
              alt={mood.label}
              fill
              className="object-cover opacity-40 group-hover:opacity-60 transition-all duration-500 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
            
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${mood.color}25 0%, transparent 70%)`,
              }}
            />

            {/* Label */}
            <span className="relative z-10 text-white font-bold text-xs tracking-wider uppercase drop-shadow-md text-center px-2">
              {mood.label}
            </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
