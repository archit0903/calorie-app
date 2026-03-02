'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { calculateTDEE, calculateTargetCalories, calculateMacroTargets, getBMI, sumEntries } from '@/lib/calculations'
import type { FoodEntry } from '@/lib/calculations'
import FoodLogger from '@/components/FoodLogger'
import CalorieRing from '@/components/CalorieRing'
import MacroBar from '@/components/MacroBar'
import NutritionScanner from '@/components/NutritionScanner'

export default function DashboardPage() {
  const router = useRouter()
  const { profile, entries, selectedDate, removeEntry, clearEntries } = useAppStore()
  const [showLogger, setShowLogger] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all')

  useEffect(() => {
    if (!profile) router.push('/')
  }, [profile])

  if (!profile) return null

  const tdee = calculateTDEE(profile)
  const targetCalories = calculateTargetCalories(profile)
  const macros = calculateMacroTargets(targetCalories, profile.goal)
  const bmi = getBMI(profile.weight, profile.height)

  const todayEntries = entries.filter(e => {
    const d = new Date(e.addedAt).toISOString().split('T')[0]
    return d === selectedDate
  })

  const filteredEntries = activeTab === 'all' ? todayEntries : todayEntries.filter(e => e.mealType === activeTab)
  const totals = sumEntries(todayEntries)
  const remaining = targetCalories - totals.calories
  const pct = Math.min(100, Math.round((totals.calories / targetCalories) * 100))

  const goalLabel = profile.goal === 'deficit' ? 'cutting' : profile.goal === 'bulk' ? 'bulking' : 'maintaining'
  const goalColor = profile.goal === 'deficit' ? 'var(--orange)' : profile.goal === 'bulk' ? 'var(--blue)' : 'var(--accent)'
  const statusMsg = remaining > 0
    ? `${remaining} cal remaining`
    : `${Math.abs(remaining)} cal over target`

  const mealTypes = ['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const
  const mealEmojis = { all: '📋', breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }

  return (
    <main style={{ minHeight: '100vh', maxWidth: 480, margin: '0 auto', padding: '0 0 100px' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⚡</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>Caloria</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={() => router.push('/')} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 14px', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
          Edit Profile
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Main calorie card */}
        <div className="card glow" style={{ marginBottom: '16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: `${goalColor}08`, borderRadius: '50%' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ textAlign: 'left' }}>
              <span className={`tag tag-${profile.goal === 'deficit' ? 'orange' : profile.goal === 'bulk' ? 'blue' : 'green'}`}>
                {goalLabel}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>BMI</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: bmi.color, fontSize: '1.1rem' }}>{bmi.value}</div>
              <div style={{ fontSize: '0.7rem', color: bmi.color }}>{bmi.label}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <CalorieRing consumed={totals.calories} target={targetCalories} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Target', value: targetCalories, unit: 'kcal', color: 'var(--muted)' },
              { label: 'Eaten', value: Math.round(totals.calories), unit: 'kcal', color: 'var(--text)' },
              { label: remaining > 0 ? 'Remaining' : 'Over', value: Math.abs(remaining), unit: 'kcal', color: remaining > 0 ? 'var(--accent)' : 'var(--red)' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '12px', background: 'var(--surface2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: stat.color }}>{stat.value.toLocaleString()}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{stat.unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Macros */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Macros Today</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>target → consumed</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <MacroBar label="Protein" consumed={Math.round(totals.protein)} target={macros.protein} color="#42b3ff" unit="g" emoji="🥩" />
            <MacroBar label="Carbs" consumed={Math.round(totals.carbs)} target={macros.carbs} color="#c8f542" unit="g" emoji="🍚" />
            <MacroBar label="Fat" consumed={Math.round(totals.fat)} target={macros.fat} color="#ff8c42" unit="g" emoji="🫒" />
          </div>
        </div>

        {/* TDEE info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '4px' }}>Resting BMR</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>
              {Math.round(profile.weight * 10 + profile.height * 6.25 - profile.age * 5 + (profile.gender === 'male' ? 5 : -161)).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>kcal at complete rest</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '4px' }}>TDEE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: goalColor }}>
              {tdee.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>with activity</div>
          </div>
        </div>

        {/* Add food buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => setShowLogger(true)} className="btn-accent" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>🍽</span> Log Food
          </button>
          <button onClick={() => setShowScanner(true)} className="btn-ghost" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>📷</span> Scan Label
          </button>
        </div>

        {/* Meal tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {mealTypes.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '6px 14px', borderRadius: '100px', border: `1px solid ${activeTab === t ? 'var(--accent)' : 'var(--border)'}`,
              background: activeTab === t ? 'var(--accent-dim)' : 'var(--surface)',
              color: activeTab === t ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-display)', fontWeight: 600,
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s',
            }}>
              <span>{mealEmojis[t]}</span>{t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Food entries */}
        {filteredEntries.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍽️</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '6px' }}>No food logged yet</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Add your meals to start tracking</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} onRemove={() => removeEntry(entry.id)} />
            ))}
          </div>
        )}

        {todayEntries.length > 0 && (
          <button onClick={() => clearEntries(selectedDate)} style={{ marginTop: '16px', width: '100%', background: 'none', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px', color: 'var(--red)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            🗑 Clear Today's Log
          </button>
        )}
      </div>

      {showLogger && <FoodLogger onClose={() => setShowLogger(false)} />}
      {showScanner && <NutritionScanner onClose={() => setShowScanner(false)} />}
    </main>
  )
}

function EntryCard({ entry, onRemove }: { entry: FoodEntry, onRemove: () => void }) {
  const mealColors = { breakfast: 'var(--orange)', lunch: 'var(--accent)', dinner: 'var(--blue)', snack: '#c084fc' }
  return (
    <div className="card animate-fade-in" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: 42, height: 42, background: 'var(--surface2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
        {entry.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          {entry.servings}x {entry.unit} · P: {Math.round(entry.protein * entry.servings)}g · C: {Math.round(entry.carbs * entry.servings)}g · F: {Math.round(entry.fat * entry.servings)}g
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', fontSize: '1rem' }}>{Math.round(entry.calories * entry.servings)}</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>kcal</div>
      </div>
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px', borderRadius: '6px', fontSize: '1rem', transition: 'color 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
        ✕
      </button>
    </div>
  )
}
