'use client';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
}

export function BackButton({ href }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (typeof window === 'undefined') return;
    
    // Check if there is a previous page in the history stack of this app.
    // A simple heuristic is checking if history.length > 2 (though this includes other sites)
    // Next.js doesn't expose a clean way to check if we can go back within the app.
    // If href is provided, we can fallback to it.
    
    // If the referrer is our own site, we can safely go back.
    const isInternal = document.referrer.includes(window.location.host);
    
    if (isInternal && window.history.length > 1) {
      router.back();
    } else {
      // Fallback
      if (href) {
        router.push(href);
      } else {
        if (pathname.startsWith('/providers/')) {
          router.push('/providers');
        } else {
          router.push('/');
        }
      }
    }
  };

  const content = (
    <>
      <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
      Back
    </>
  );

  const className = "flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-200 group font-bold tracking-wider uppercase text-xs w-fit mb-6 hover:-translate-x-0.5 cursor-pointer";

  return (
    <button onClick={handleBack} className={className}>
      {content}
    </button>
  );
}
