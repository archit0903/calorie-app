'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, FoodEntry } from './calculations'

interface AppStore {
  profile: UserProfile | null
  entries: FoodEntry[]
  selectedDate: string
  setProfile: (p: UserProfile) => void
  addEntry: (e: FoodEntry) => void
  removeEntry: (id: string) => void
  updateEntryServings: (id: string, servings: number) => void
  setSelectedDate: (d: string) => void
  clearEntries: (date?: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      profile: null,
      entries: [],
      selectedDate: new Date().toISOString().split('T')[0],

      setProfile: (profile) => set({ profile }),

      addEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),

      removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

      updateEntryServings: (id, servings) =>
        set((s) => ({ entries: s.entries.map((e) => e.id === id ? { ...e, servings } : e) })),

      setSelectedDate: (selectedDate) => set({ selectedDate }),

      clearEntries: (date) => set((s) => ({
        entries: date ? s.entries.filter((e) => {
          const entryDate = new Date(e.addedAt).toISOString().split('T')[0]
          return entryDate !== date
        }) : [],
      })),
    }),
    {
      name: 'caloria-store',
      version: 1,
    }
  )
)
