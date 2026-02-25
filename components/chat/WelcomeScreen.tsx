'use client'

import { ModelMeta } from '@/types'

interface Props {
  model: ModelMeta
}

export default function WelcomeScreen({ model }: Props) {
  return (
    <div
      className="flex flex-col items-center text-center px-5 py-10 animate-fade-up"
      style={{ animation: 'fadeInUp 0.6s ease both' }}
    >
      <div className="text-5xl mb-4">{model.icon}</div>

      <h2
        className="text-2xl font-bold mb-2 relative inline-block"
        style={{ color: 'var(--wood-dark)' }}
      >
        {model.shortName}
        <span
          className="block h-1 rounded-full mt-2 mx-auto"
          style={{
            width: '80px',
            background: 'linear-gradient(90deg, var(--amber), var(--gold))',
          }}
        />
      </h2>

      <p className="text-base mt-3 max-w-md leading-7" style={{ color: 'var(--wood-medium)' }}>
        {model.welcome}
      </p>

      <div
        className="mt-5 max-w-md w-full text-left text-sm italic leading-relaxed relative pl-6"
        style={{
          background: 'var(--white)',
          padding: '16px 20px 16px 26px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-card)',
          color: 'var(--wood-medium)',
        }}
      >
        <span
          className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l-xl"
          style={{ background: 'linear-gradient(180deg, var(--amber), var(--gold))' }}
        />
        {model.verse}
      </div>
    </div>
  )
}
