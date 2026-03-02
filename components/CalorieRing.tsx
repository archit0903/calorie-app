'use client'
import { useEffect, useState } from 'react'

interface Props {
  consumed: number
  target: number
}

export default function CalorieRing({ consumed, target }: Props) {
  const [animated, setAnimated] = useState(0)
  const pct = Math.min(100, (consumed / target) * 100)
  const r = 70
  const circumference = 2 * Math.PI * r
  const over = consumed > target

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(pct), 100)
    return () => clearTimeout(timer)
  }, [pct])

  const strokeDashoffset = circumference - (animated / 100) * circumference
  const strokeColor = over ? 'var(--red)' : pct > 85 ? 'var(--orange)' : 'var(--accent)'

  return (
    <div style={{ position: 'relative', width: 180, height: 180 }}>
      <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--surface2)" strokeWidth="14" />
        {/* Progress */}
        <circle
          cx="90" cy="90" r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
        />
        {/* Glow dots at end */}
        {animated > 2 && (
          <circle cx="90" cy="90" r={r} fill="none" stroke={strokeColor} strokeWidth="2" strokeOpacity="0.15" />
        )}
      </svg>
      {/* Center text */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.9rem', lineHeight: 1, color: strokeColor, transition: 'color 0.5s' }}>
          {Math.round(animated)}%
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>
          {Math.round(consumed).toLocaleString()} kcal
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--muted)', opacity: 0.6 }}>
          of {target.toLocaleString()}
        </div>
      </div>
    </div>
  )
}
