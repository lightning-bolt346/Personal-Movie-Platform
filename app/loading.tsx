export default function Loading() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden"
      style={{ background: '#05010a' }}
    >
      {/* Atmospheric background — mirrors app layout */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '70%',
            background:
              'radial-gradient(ellipse at center, rgba(76,20,200,0.22) 0%, rgba(50,10,130,0.08) 35%, rgba(50,10,130,0.02) 60%, transparent 80%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: '40%',
            height: '45%',
            background:
              'radial-gradient(ellipse at center, rgba(30,60,180,0.10) 0%, rgba(30,60,180,0.02) 40%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            right: '-5%',
            width: '35%',
            height: '40%',
            background:
              'radial-gradient(ellipse at center, rgba(100,30,200,0.08) 0%, rgba(100,30,200,0.02) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          opacity: 0.03,
        }}
      />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center gap-10">

        {/* ZIVOX Logo — same markup as Navbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            animation: 'fade-in 0.6s ease-out forwards',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontWeight: 900,
              fontSize: '3rem',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ZIV
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.8rem',
              height: '2.8rem',
              borderRadius: '50%',
              border: '3px solid rgba(229, 9, 20, 0.9)',
              boxShadow: '0 0 24px rgba(229,9,20,0.7), 0 0 60px rgba(229,9,20,0.25), inset 0 0 12px rgba(229,9,20,0.15)',
              margin: '0 2px',
              animation: 'pulse-glow 2.5s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)',
              fontWeight: 900,
              fontSize: '3rem',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            X
          </span>
        </div>

        {/* Loading bar */}
        <div className="flex flex-col items-center gap-3 w-full max-w-[280px]">
          <div
            style={{
              width: '100%',
              height: '2px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '9999px',
                background: 'linear-gradient(to right, #e50914, #ff3d47)',
                boxShadow: '0 0 12px rgba(229,9,20,0.7)',
                animation: 'loading-scan 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              animation: 'fade-in 0.8s 0.3s ease-out both',
            }}
          >
            Loading Cinema
          </p>
        </div>

        {/* Skeleton rows — subtle, minimal */}
        <div
          className="flex flex-col gap-10 w-[min(90vw,1200px)]"
          style={{ animation: 'fade-in 0.6s 0.2s ease-out both' }}
        >
          {/* Row skeleton */}
          {[1, 2].map((row) => (
            <div key={row} className="flex flex-col gap-3">
              {/* Row title skeleton */}
              <div
                style={{
                  height: '18px',
                  width: '180px',
                  borderRadius: '6px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.8s infinite linear',
                }}
              />
              {/* Cards skeleton */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  overflow: 'hidden',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((card) => (
                  <div
                    key={card}
                    style={{
                      flexShrink: 0,
                      width: 'clamp(100px, 12vw, 150px)',
                      aspectRatio: '2/3',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0d0d0f 0%, #141418 40%, #0d0d0f 100%)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                        animation: `shimmer ${1.6 + card * 0.08}s infinite linear`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes loading-scan {
          0% { width: 0%; margin-left: 0; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
