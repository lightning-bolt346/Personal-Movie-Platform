'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Film, ArrowRight } from 'lucide-react';
import { generateSlug } from '@/lib/utils';

interface Collection {
  id: number;
  name: string;
  backdrop: string;
  poster: string;
  movieCount: number;
  tagline: string;
}

// Curated by a movie enthusiast — classics + modern franchises worth knowing
const CURATED_COLLECTIONS: Collection[] = [
  { id: 263, name: 'The Dark Knight Trilogy', backdrop: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg', poster: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', movieCount: 3, tagline: "Nolan's definitive superhero epic" },
  { id: 119, name: 'The Lord of the Rings', backdrop: '/sD9NESwYpOFWvDvnHHwz9eCl3eY.jpg', poster: '/cAmEXs9GGCF0e1CGCyFRYCJjTmI.jpg', movieCount: 3, tagline: 'The greatest fantasy trilogy' },
  { id: 230, name: 'The Godfather', backdrop: '/tmU7GeKVybMWFbwHZEDrrnzJHbv.jpg', poster: '/3bhkrj58Vtu7enYsLe1rhdUT6sa.jpg', movieCount: 3, tagline: "Cinema's greatest achievement" },
  { id: 131292, name: 'MCU Collection', backdrop: '/tWqifoYuwLETmmasnGHO7xBjEtt.jpg', poster: '/pQFoyx7gek8phiqJA4y7lOtpRNm.jpg', movieCount: 33, tagline: 'The ultimate connected universe' },
  { id: 307080, name: 'Star Wars Skywalker Saga', backdrop: '/zOpeQKcS7PZIJFMkjGoQFMTWjiO.jpg', poster: '/d8duYyyC9J5T825Hg7grmaabfxQ.jpg', movieCount: 9, tagline: 'A galaxy far, far away' },
  { id: 84, name: 'Indiana Jones', backdrop: '/AtmfYTslBTEhQpwON28lIhBqkwB.jpg', poster: '/g54E87NWwq2SMJRqRMfnmx42UuA.jpg', movieCount: 5, tagline: 'The original adventure hero' },
  { id: 10, name: 'Star Wars Original', backdrop: '/zOpeQKcS7PZIJFMkjGoQFMTWjiO.jpg', poster: '/btTdmkgIvOi0FFip1sPuZI2oQG6.jpg', movieCount: 3, tagline: 'Where it all began' },
  { id: 404609, name: 'John Wick', backdrop: '/fSwYa5q6QUGLBGxGMalKdNHiuqG.jpg', poster: '/vx1mQ30LNFbIlqmMBjISTFiAbcW.jpg', movieCount: 4, tagline: 'Modern action at its finest' },
  { id: 87359, name: 'Mission: Impossible', backdrop: '/bSqt9rhDZx1Q7UZ86dBPd1CTUNR.jpg', poster: '/dST0qWf7VeVo5Ge6vf7CjAFVMIl.jpg', movieCount: 8, tagline: 'The best ongoing action franchise' },
  { id: 645, name: 'James Bond', backdrop: '/cmWoodFHQVHzNOlfOiRSz9GPFpS.jpg', poster: '/svPVMgH3aOaFkS7iS6sHWHTWjJA.jpg', movieCount: 27, tagline: '60 years of the greatest spy' },
  { id: 2344, name: 'The Matrix', backdrop: '/bRm2DEgUiYciDw3myHuYFInD7la.jpg', poster: '/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg', movieCount: 4, tagline: 'The sci-fi landmark' },
  { id: 328, name: 'Jurassic Park', backdrop: '/rLSUjr725ez1cK7SKVxC9qly7I0.jpg', poster: '/9i3plLl89DHMz7mahksDaAo8Yys.jpg', movieCount: 6, tagline: '30 years of dino carnage' },
  { id: 10194, name: 'Toy Story', backdrop: '/9FrPDAI8Yv5RWqEMakx8uVBRQNl.jpg', poster: '/uXDfjJbdP4ijW5hWSBrPu9WT85S.jpg', movieCount: 4, tagline: "Pixar's timeless masterpiece" },
  { id: 173710, name: 'Planet of the Apes', backdrop: '/n1RgHCjCxCEIBPsFJOCNIbxPkR2.jpg', poster: '/af3NRp7baGxLEfQbVoSdEaEmqKK.jpg', movieCount: 6, tagline: 'The reboot done right' },
  { id: 9485, name: 'Fast & Furious', backdrop: '/y4D3OMOHPQ1Qm2pYLRSxfhO3SjO.jpg', poster: '/3P52oz9HPQdxsxLM2LYtor2KCHI.jpg', movieCount: 11, tagline: "Family. Always." },
];

export function CollectionsRow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('row-revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '-60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? el.clientWidth * 0.75 : -(el.clientWidth * 0.75), behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <section ref={sectionRef} className="relative group/row row-hidden">
      {/* Header */}
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-14 mb-3 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          🎬 Iconic Collections
        </h2>
        <Link
          href="/discover"
          className="flex items-center gap-1 text-sm font-semibold text-white/35 hover:text-white/80 transition-colors duration-200 group"
        >
          View All
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      </div>

      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className={`absolute left-4 md:left-14 top-[55%] -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full transition-[opacity,transform] duration-200 ${canScrollLeft ? 'opacity-100 hover:scale-110 active:scale-95' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(6,6,6,0.9)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className={`absolute right-4 md:right-14 top-[55%] -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full transition-[opacity,transform] duration-200 ${canScrollRight ? 'opacity-100 hover:scale-110 active:scale-95' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(6,6,6,0.9)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
      >
        <ChevronRight size={20} className="text-white" />
      </button>

      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-[4%] z-20 pointer-events-none transition-opacity duration-300"
        style={{ background: 'linear-gradient(to right, #05010a, transparent)', opacity: canScrollLeft ? 1 : 0 }} />
      <div className="absolute right-0 top-0 bottom-0 w-[4%] z-20 pointer-events-none transition-opacity duration-300"
        style={{ background: 'linear-gradient(to left, #05010a, transparent)', opacity: canScrollRight ? 1 : 0 }} />

      {/* Scroll track */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth"
        style={{
          paddingLeft: 'max(1rem, calc((100vw - 1800px) / 2 + 3.5rem))',
          paddingRight: 'max(1rem, calc((100vw - 1800px) / 2 + 3.5rem))',
          paddingTop: '8px',
          paddingBottom: '24px',
          touchAction: 'pan-x pan-y',
        }}
      >
        {CURATED_COLLECTIONS.map((col) => (
          <Link
            key={col.id}
            href={`/collection/${generateSlug(col.id.toString(), col.name)}`}
            className="relative flex-shrink-0 group/card rounded-xl overflow-hidden cursor-pointer"
            style={{ width: 'clamp(240px, 28vw, 340px)', aspectRatio: '16/9' }}
          >
            {/* Backdrop image */}
            <Image
              src={`https://image.tmdb.org/t/p/w780${col.backdrop}`}
              alt={col.name}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 30vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover/card:scale-[1.05]"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            {/* Active scale effect on hover */}
            <div className="absolute inset-0 border border-white/0 group-hover/card:border-white/15 rounded-xl transition-colors duration-300" />

            {/* Movie count badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full">
              <Film size={9} className="text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-300">{col.movieCount}</span>
            </div>

            {/* Bottom text */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-white font-display font-bold text-sm md:text-base leading-tight">
                {col.name}
              </h3>
              <p className="text-zinc-400 text-[11px] mt-0.5 leading-tight opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                {col.tagline}
              </p>
            </div>
          </Link>
        ))}
        <div className="flex-shrink-0 w-4 md:w-8" aria-hidden="true" />
      </div>
    </section>
  );
}
