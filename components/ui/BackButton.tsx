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
    
    try {
      const sessionStack = sessionStorage.getItem('app_history_stack');
      const stack: string[] = sessionStack ? JSON.parse(sessionStack) : [];
      
      // If we have more than 1 item in our internal app stack, 
      // we can safely go back natively without leaving the app.
      if (stack.length > 1) {
        sessionStorage.setItem('is_back_nav', 'true');
        router.back();
        return;
      }
    } catch (e) {
      console.error('Failed to navigate back using history stack:', e);
    }

    // Fallback if no internal history (e.g. opened directly via a link)
    // We use router.replace to prevent trapping the user in a forward-history loop
    if (href) {
      router.replace(href);
    } else {
      if (pathname.startsWith('/providers/')) {
        router.replace('/providers');
      } else if (pathname.startsWith('/collection/')) {
        router.replace('/collections');
      } else {
        router.replace('/');
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
