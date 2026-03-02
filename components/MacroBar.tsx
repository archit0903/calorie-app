'use client'
import { useEffect, useState } from 'react'

interface Props {
  label: string
  consumed: number
  target: number
  color: string
  unit: string
  emoji: string
}

export default function MacroBar({ label, consumed, target, color, unit, emoji }: Props) {
  const [width, setWidth] = useState(0)
  const pct = Math.min(100, Math.round((consumed / target) * 100))
  const over = consumed > target

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.9rem' }}>{emoji}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem' }}>{label}</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: over ? 'var(--red)' : 'var(--muted)' }}>
          <span style={{ color: over ? 'var(--red)' : 'var(--text)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{consumed}</span>
          <span style={{ color: 'var(--muted)' }}> / {target}{unit}</span>
        </div>
      </div>
      <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: over ? 'var(--red)' : color,
          borderRadius: 100,
          transition: 'width 0.8s ease, background 0.3s',
          boxShadow: `0 0 8px ${over ? 'rgba(255,77,77,0.4)' : color}40`,
        }} />
      </div>
    </div>
  )
}
