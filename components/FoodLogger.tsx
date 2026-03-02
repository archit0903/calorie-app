'use client'
import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/lib/store'
import { searchFoods, FOOD_CATEGORIES, type FoodItem } from '@/lib/foodDatabase'
import type { FoodEntry } from '@/lib/calculations'

interface Props {
  onClose: () => void
}

export default function FoodLogger({ onClose }: Props) {
  const { addEntry, selectedDate } = useAppStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodItem[]>(searchFoods(''))
  const [selected, setSelected] = useState<FoodItem | null>(null)
  const [servings, setServings] = useState(1)
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const filtered = searchFoods(query)
    if (activeCategory !== 'All') {
      setResults(filtered.filter(f => f.category === activeCategory))
    } else {
      setResults(filtered)
    }
  }, [query, activeCategory])

  function selectFood(food: FoodItem) {
    setSelected(food)
    setServings(food.defaultServing)
  }

  function logFood() {
    if (!selected) return
    const entry: FoodEntry = {
      id: `${Date.now()}-${Math.random()}`,
      foodId: selected.id,
      name: selected.name,
      emoji: selected.emoji,
      calories: selected.calories,
      protein: selected.protein,
      carbs: selected.carbs,
      fat: selected.fat,
      servings,
      unit: selected.unit,
      addedAt: new Date(selectedDate).getTime() + Date.now() % 86400000,
      mealType,
    }
    addEntry(entry)
    if (selected) {
      setSelected(null)
      setQuery('')
      setServings(1)
      setResults(searchFoods(''))
    }
  }

  const categories = ['All', ...FOOD_CATEGORIES]
  const mealOptions = ['breakfast', 'lunch', 'dinner', 'snack'] as const
  const mealEmojis = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: 'var(--surface)', borderRadius: '24px 24px 0 0', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border)', borderBottom: 'none', animation: 'slideUp 0.3s ease-out' }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
          <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2 }} />
        </div>

        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem' }}>
              {selected ? '📏 Set Serving' : '🔍 Find Food'}
            </h2>
            <button onClick={onClose} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.85rem' }}>✕</button>
          </div>

          {!selected ? (
            <>
              {/* Search */}
              <input
                ref={inputRef}
                type="text"
                placeholder="Search chicken, rice, apple..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ marginBottom: '12px' }}
              />

              {/* Category pills */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '4px' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                    padding: '5px 12px', borderRadius: '100px', border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
                    background: activeCategory === cat ? 'var(--accent-dim)' : 'var(--surface2)',
                    color: activeCategory === cat ? 'var(--accent)' : 'var(--muted)',
                    cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 600,
                    whiteSpace: 'nowrap', transition: 'all 0.15s',
                  }}>
                    {cat}
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Selected food details */
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '14px', background: 'var(--surface2)', borderRadius: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '2rem' }}>{selected.emoji}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{selected.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{selected.unit}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.85rem' }}>Change</button>
              </div>

              {/* Macro preview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {[
                  { label: 'Calories', value: Math.round(selected.calories * servings), color: 'var(--accent)' },
                  { label: 'Protein', value: `${Math.round(selected.protein * servings)}g`, color: 'var(--blue)' },
                  { label: 'Carbs', value: `${Math.round(selected.carbs * servings)}g`, color: 'var(--accent)' },
                  { label: 'Fat', value: `${Math.round(selected.fat * servings)}g`, color: 'var(--orange)' },
                ].map(m => (
                  <div key={m.label} style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: m.color, fontSize: '1rem' }}>{m.value}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Food list or controls */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 20px' }}>
          {!selected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: '8px' }}>
              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>No foods found for "{query}"</div>
              ) : results.map(food => (
                <button key={food.id} onClick={() => selectFood(food)} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                  background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '12px',
                  cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s',
                  width: '100%',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-mid)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{food.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>{food.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{food.unit}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', fontSize: '0.95rem' }}>{food.calories}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>kcal</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              {/* Servings */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>Servings</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => setServings(s => Math.max(0.25, s - 0.25))} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <input type="number" value={servings} min={0.25} step={0.25}
                    onChange={e => setServings(Math.max(0.25, Number(e.target.value)))}
                    style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', width: '80px' }} />
                  <button onClick={() => setServings(s => s + 0.25)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>

              {/* Meal type */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>Meal Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {mealOptions.map(m => (
                    <button key={m} onClick={() => setMealType(m)} style={{
                      padding: '10px 6px', border: `2px solid ${mealType === m ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: '10px', background: mealType === m ? 'var(--accent-dim)' : 'var(--surface2)',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.15s',
                    }}>
                      <span style={{ fontSize: '1rem' }}>{mealEmojis[m]}</span>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: mealType === m ? 'var(--accent)' : 'var(--muted)', textTransform: 'capitalize' }}>{m}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {selected && (
          <div style={{ padding: '16px 20px 32px' }}>
            <button className="btn-accent" onClick={logFood} style={{ width: '100%', fontSize: '1rem' }}>
              + Add to Log
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
