'use client'
import { useState, useRef } from 'react'
import { useAppStore } from '@/lib/store'
import type { FoodEntry } from '@/lib/calculations'

interface Props {
  onClose: () => void
}

interface ScannedNutrition {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  emoji: string
}

export default function NutritionScanner({ onClose }: Props) {
  const { addEntry, selectedDate } = useAppStore()
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScannedNutrition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [servings, setServings] = useState(1)
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImage(file: File) {
    setError(null)
    setResult(null)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1]
      const dataUrl = e.target?.result as string
      setImage(dataUrl)
      await analyzeImage(base64, file.type)
    }
    reader.readAsDataURL(file)
  }

  async function analyzeImage(base64: string, mediaType: string) {
    setLoading(true)
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, mediaType: mediaType || 'image/jpeg' }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || `Server error ${response.status}`)
      }

      const nutrition = await response.json() as ScannedNutrition
      if (!nutrition.calories && nutrition.calories !== 0) throw new Error('Invalid nutrition data returned')
      setResult(nutrition)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze image'
      setError('Could not read nutrition info. Make sure the label is clear and well-lit. ' + msg)
    } finally {
      setLoading(false)
    }
  }

  function logFood() {
    if (!result) return
    const entry: FoodEntry = {
      id: `${Date.now()}-${Math.random()}`,
      foodId: `scanned-${Date.now()}`,
      name: result.name,
      emoji: result.emoji || '📦',
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      servings,
      unit: result.servingSize,
      addedAt: new Date(selectedDate).getTime() + Date.now() % 86400000,
      mealType,
      isCustom: true,
    }
    addEntry(entry)
    onClose()
  }

  const mealOptions = ['breakfast', 'lunch', 'dinner', 'snack'] as const
  const mealEmojis = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: 'var(--surface)', borderRadius: '24px 24px 0 0', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border)', borderBottom: 'none', animation: 'slideUp 0.3s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
          <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2 }} />
        </div>

        <div style={{ padding: '16px 20px', flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem' }}>📷 Scan Nutrition Label</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '2px' }}>AI-powered nutrition extraction</p>
            </div>
            <button onClick={onClose} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.85rem' }}>✕</button>
          </div>

          {!image ? (
            <div>
              {/* Upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--border)', borderRadius: '16px', padding: '48px 24px',
                  textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
                  marginBottom: '16px',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📸</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>Upload Nutrition Label</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Take a photo of any nutrition facts panel</div>
                <div style={{ marginTop: '16px' }}>
                  <span style={{ background: 'var(--accent)', color: '#000', padding: '8px 20px', borderRadius: '8px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem' }}>
                    Choose Photo
                  </span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handleImage(e.target.files[0])}
              />

              {/* Tips */}
              <div className="card" style={{ padding: '14px', background: 'var(--surface2)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: 'var(--accent)' }}>📋 Tips for best results</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {['Hold camera steady and close to the label', 'Ensure good lighting — avoid shadows', 'Works on any packaged food nutrition panel'].map(tip => (
                    <div key={tip} style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
                      <span>·</span>{tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Image preview */}
              <div style={{ position: 'relative', marginBottom: '16px', borderRadius: '12px', overflow: 'hidden' }}>
                <img src={image} alt="Nutrition label" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
                {loading && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <div style={{ width: 40, height: 40, border: '3px solid var(--accent-mid)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', fontSize: '0.9rem' }}>Analyzing...</div>
                  </div>
                )}
              </div>

              <button onClick={() => { setImage(null); setResult(null); setError(null) }} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                ← Try another image
              </button>

              {error && (
                <div style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '16px', color: 'var(--red)', fontSize: '0.85rem' }}>
                  ⚠️ {error}
                </div>
              )}

              {result && (
                <div>
                  {/* Result card */}
                  <div className="card" style={{ marginBottom: '16px', border: '1px solid var(--accent-mid)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '2rem' }}>{result.emoji}</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>{result.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Per {result.servingSize}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>
                        {Math.round(result.calories * servings)}
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block', textAlign: 'right' }}>kcal</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                      {[
                        { label: 'Protein', value: result.protein * servings, color: 'var(--blue)' },
                        { label: 'Carbs', value: result.carbs * servings, color: 'var(--accent)' },
                        { label: 'Fat', value: result.fat * servings, color: 'var(--orange)' },
                      ].map(m => (
                        <div key={m.label} style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: m.color, fontSize: '1.1rem' }}>{Math.round(m.value)}g</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{m.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Servings */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--muted)' }}>Servings</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => setServings(s => Math.max(0.25, s - 0.25))} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', color: 'var(--text)', fontSize: '1.1rem' }}>−</button>
                        <input type="number" value={servings} min={0.25} step={0.25}
                          onChange={e => setServings(Math.max(0.25, Number(e.target.value)))}
                          style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, width: '70px' }} />
                        <button onClick={() => setServings(s => s + 0.25)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', color: 'var(--text)', fontSize: '1.1rem' }}>+</button>
                      </div>
                    </div>

                    {/* Meal type */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {mealOptions.map(m => (
                        <button key={m} onClick={() => setMealType(m)} style={{
                          padding: '8px 4px', border: `2px solid ${mealType === m ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: '10px', background: mealType === m ? 'var(--accent-dim)' : 'var(--surface2)',
                          cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', transition: 'all 0.15s',
                        }}>
                          <span style={{ fontSize: '0.9rem' }}>{mealEmojis[m]}</span>
                          <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: mealType === m ? 'var(--accent)' : 'var(--muted)', textTransform: 'capitalize' }}>{m}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="btn-accent" onClick={logFood} style={{ width: '100%', fontSize: '1rem' }}>
                    + Add to Log
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
