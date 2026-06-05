'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string; // Kept for type compatibility, but ignored
}

export function BackButton({ href }: BackButtonProps) {
  const router = useRouter();
  
  const content = (
    <>
      <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
      Back
    </>
  );

  const className = "flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-200 group font-bold tracking-wider uppercase text-xs w-fit mb-6 hover:-translate-x-0.5";

  return (
    <button onClick={() => {
      router.back();
      // Wait a tiny bit for the navigation to start, then force scroll to top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 50);
    }} className={className}>
      {content}
    </button>
  );
}
