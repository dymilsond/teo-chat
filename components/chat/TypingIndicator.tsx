'use client'

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 animate-fade-up">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 border-2"
        style={{
          background: 'linear-gradient(135deg, var(--wood-medium), var(--wood-dark))',
          borderColor: 'var(--amber)',
        }}
      >
        ✝
      </div>
      <div
        className="flex gap-1.5 items-center px-4 py-3 rounded-[4px_15px_15px_15px] relative"
        style={{
          background: 'var(--white)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid rgba(0,0,0,0.05)',
          paddingLeft: '22px',
        }}
      >
        <div
          className="absolute top-0 left-0 bottom-0 w-1 rounded-[4px_0_0_4px]"
          style={{ background: 'linear-gradient(180deg, var(--amber), var(--gold))' }}
        />
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: 'var(--amber)',
              animation: `typing-bounce 1.4s ease infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
