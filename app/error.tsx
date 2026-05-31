'use client';
export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-2xl font-bold text-cyan-400">Something went wrong</h2>
      <p className="text-zinc-400">{error.message || 'An unexpected error occurred.'}</p>
      <button 
        onClick={() => reset()} 
        className="px-6 py-2 bg-void-800 hover:bg-void-700 transition-colors rounded-xl"
      >
        Try again
      </button>
    </div>
  );
}
