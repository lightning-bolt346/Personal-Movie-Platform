'use client';
import { useScrollRestore } from '@/hooks/useScrollRestore';

export default function Template({ children }: { children: React.ReactNode }) {
  useScrollRestore();
  return (
    <div className="flex flex-col flex-1 animate-page-enter">
      {children}
    </div>
  );
}
