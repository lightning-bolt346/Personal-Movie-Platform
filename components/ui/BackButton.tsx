'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-200 group font-bold tracking-wider uppercase text-xs w-fit mb-6 hover:-translate-x-0.5"
    >
      <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
      Back
    </button>
  );
}
