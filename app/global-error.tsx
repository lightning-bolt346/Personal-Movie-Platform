'use client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isChunkError =
    error?.message?.includes('chunk') ||
    error?.message?.includes('Loading CSS chunk') ||
    error?.message?.includes('Failed to load') ||
    error?.name === 'ChunkLoadError';

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#050108', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            gap: '1.5rem',
          }}
        >
          {/* Logo */}
          <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
            ZI<span style={{ color: 'rgb(var(--brand-500))' }}>V</span>OX
          </div>

          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
              {isChunkError ? 'Connection Interrupted' : 'Something went wrong'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.5 }}>
              {isChunkError
                ? 'A page asset failed to load. This usually happens on slow connections. Please try again.'
                : error?.message || 'An unexpected error occurred.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                background: 'rgb(var(--brand-500))',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '0.75rem 1.75rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              Go Home
            </button>
          </div>

          {isChunkError && (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
              If this keeps happening, try refreshing the page or checking your connection.
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
