import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4 text-center">
      <h2 className="text-4xl font-display font-black text-cyan-400">404</h2>
      <p className="text-zinc-400">Page not found</p>
      <Link href="/" className="px-6 py-2 bg-void-800 hover:bg-void-700 transition-colors rounded-xl">
        Return Home
      </Link>
    </div>
  );
}
