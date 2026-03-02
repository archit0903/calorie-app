'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { UserProfile } from '@/lib/calculations'
import { calculateBMR, calculateTDEE, calculateTargetCalories, ACTIVITY_LABELS, ACTIVITY_DESCRIPTIONS } from '@/lib/calculations'

const steps = ['basics', 'body', 'activity', 'goal']

export default function OnboardingPage() {
  const router = useRouter()
  const { profile, setProfile } = useAppStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Partial<UserProfile>>({
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    weight: undefined,
    height: undefined,
    age: undefined,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update(key: keyof UserProfile, value: unknown) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => { const n = {...e}; delete n[key]; return n })
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (step === 1) {
      if (!form.age || form.age < 10 || form.age > 120) e.age = 'Enter age 10–120'
      if (!form.weight || form.weight < 20 || form.weight > 400) e.weight = 'Enter weight 20–400 kg'
      if (!form.height || form.height < 100 || form.height > 250) e.height = 'Enter height 100–250 cm'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (!validate()) return
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      const p = form as UserProfile
      setProfile(p)
      router.push('/dashboard')
    }
  }

  function prev() { setStep(s => s - 1) }

  const progress = ((step + 1) / steps.length) * 100

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Logo */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.03em' }}>Caloria</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Smart nutrition, effortlessly tracked</p>
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: 520, position: 'relative', overflow: 'hidden' }}>
        {/* Progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--border)' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', transition: 'width 0.4s ease', borderRadius: '0 2px 2px 0' }} />
        </div>

        <div style={{ paddingTop: '8px' }}>
          {/* Step indicators */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
            {steps.map((_, i) => (
              <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--accent)' : 'var(--border)', transition: 'background 0.3s' }} />
            ))}
          </div>

          {step === 0 && <StepBasics form={form} update={update} />}
          {step === 1 && <StepBody form={form} update={update} errors={errors} />}
          {step === 2 && <StepActivity form={form} update={update} />}
          {step === 3 && <StepGoal form={form} update={update} />}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          {step > 0 && (
            <button className="btn-ghost" onClick={prev} style={{ flex: 1 }}>← Back</button>
          )}
          <button className="btn-accent" onClick={next} style={{ flex: 2 }}>
            {step === steps.length - 1 ? 'Calculate & Start →' : 'Continue →'}
          </button>
        </div>
      </div>

      {/* Already have profile */}
      {profile && (
        <button onClick={() => router.push('/dashboard')} style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
          Go back to my dashboard
        </button>
      )}
    </main>
  )
}

function StepBasics({ form, update }: { form: Partial<UserProfile>, update: Function }) {
  return (
    <div className="animate-slide-up">
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.03em' }}>Let's start with the basics</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '28px', fontSize: '0.9rem' }}>Your profile helps us calculate your precise caloric needs</p>

      <div style={{ display: 'flex', gap: '12px' }}>
        {(['male', 'female'] as const).map(g => (
          <button key={g} onClick={() => update('gender', g)} style={{
            flex: 1, padding: '20px', border: `2px solid ${form.gender === g ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '12px', background: form.gender === g ? 'var(--accent-dim)' : 'var(--surface2)',
            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ fontSize: '2rem' }}>{g === 'male' ? '♂' : '♀'}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: form.gender === g ? 'var(--accent)' : 'var(--text)', textTransform: 'capitalize' }}>{g}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepBody({ form, update, errors }: { form: Partial<UserProfile>, update: Function, errors: Record<string, string> }) {
  return (
    <div className="animate-slide-up">
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.03em' }}>Your body metrics</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '28px', fontSize: '0.9rem' }}>Used for the Mifflin-St Jeor formula — most accurate BMR calculation</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { key: 'age', label: 'Age', placeholder: '25', suffix: 'years' },
          { key: 'weight', label: 'Weight', placeholder: '70', suffix: 'kg' },
          { key: 'height', label: 'Height', placeholder: '175', suffix: 'cm' },
        ].map(({ key, label, placeholder, suffix }) => (
          <div key={key}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>{label}</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                placeholder={placeholder}
                value={(form as any)[key] ?? ''}
                onChange={e => update(key, e.target.value ? Number(e.target.value) : undefined)}
                style={{ paddingRight: '52px' }}
              />
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '0.85rem' }}>{suffix}</span>
            </div>
            {errors[key] && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: '4px' }}>{errors[key]}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

function StepActivity({ form, update }: { form: Partial<UserProfile>, update: Function }) {
  const levels = ['sedentary', 'light', 'moderate', 'active', 'very_active'] as const
  return (
    <div className="animate-slide-up">
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.03em' }}>Activity level</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '0.9rem' }}>How active are you on a typical week?</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {levels.map(level => (
          <button key={level} onClick={() => update('activityLevel', level)} style={{
            padding: '14px 16px', border: `2px solid ${form.activityLevel === level ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '12px', background: form.activityLevel === level ? 'var(--accent-dim)' : 'var(--surface2)',
            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: form.activityLevel === level ? 'var(--accent)' : 'var(--text)', fontSize: '0.95rem' }}>
                {ACTIVITY_LABELS[level]}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px' }}>{ACTIVITY_DESCRIPTIONS[level]}</div>
            </div>
            {form.activityLevel === level && <span style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

function StepGoal({ form, update }: { form: Partial<UserProfile>, update: Function }) {
  const goals = [
    { key: 'deficit', emoji: '🔥', label: 'Lose Weight', desc: '500 cal deficit/day (~0.5kg/week)', color: 'var(--red)' },
    { key: 'maintain', emoji: '⚖️', label: 'Maintain Weight', desc: 'Eat at your TDEE', color: 'var(--accent)' },
    { key: 'bulk', emoji: '💪', label: 'Build Muscle', desc: '300 cal surplus/day', color: 'var(--blue)' },
  ] as const

  return (
    <div className="animate-slide-up">
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.03em' }}>What's your goal?</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '0.9rem' }}>We'll set your daily calorie target based on this</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goals.map(({ key, emoji, label, desc, color }) => (
          <button key={key} onClick={() => update('goal', key)} style={{
            padding: '20px', border: `2px solid ${form.goal === key ? color : 'var(--border)'}`,
            borderRadius: '12px', background: form.goal === key ? `${color}15` : 'var(--surface2)',
            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', gap: '16px', alignItems: 'center',
          }}>
            <span style={{ fontSize: '1.8rem' }}>{emoji}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: form.goal === key ? color : 'var(--text)' }}>{label}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '2px' }}>{desc}</div>
            </div>
            {form.goal === key && <span style={{ marginLeft: 'auto', color }}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
