import type { Plan } from '@/types'

interface Props {
  plan: Plan
  size?: 'sm' | 'xs'
}

export default function PlanBadge({ plan, size = 'sm' }: Props) {
  const isPro = plan === 'pro'

  const style: React.CSSProperties = isPro
    ? {
        background: 'linear-gradient(135deg, #FFB74D, #FF8C00)',
        color: '#fff',
        border: 'none',
      }
    : {
        background: 'rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.6)',
        border: '1px solid rgba(255,255,255,0.2)',
      }

  return (
    <span
      style={{
        ...style,
        display: 'inline-block',
        fontSize: size === 'xs' ? 9 : 10,
        fontWeight: 700,
        letterSpacing: '0.05em',
        padding: size === 'xs' ? '1px 5px' : '2px 6px',
        borderRadius: 4,
        lineHeight: 1.4,
        textTransform: 'uppercase',
      }}
    >
      {isPro ? 'Pro' : 'Free'}
    </span>
  )
}
