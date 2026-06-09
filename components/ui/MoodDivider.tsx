export function MoodDivider() {
  return (
    <div className="w-full py-8 md:py-12 flex justify-center">
      <hr 
        className="w-[90%] max-w-5xl border-none h-[1px]"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)'
        }}
      />
    </div>
  );
}
