import { useState, useCallback, useEffect } from 'react'
import { getDateKey, getDurationMinutes } from '../utils/time'

const STORAGE_KEY = 'time-tracker-entries'

const loadEntries = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveEntries = (entries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export const useEntries = () => {
  const [entries, setEntries] = useState(loadEntries)

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const addEntry = useCallback((entry) => {
    const duration = getDurationMinutes(entry.startTime, entry.endTime)
    const newEntry = {
      ...entry,
      id: entry.id || crypto.randomUUID(),
      duration,
    }
    setEntries((prev) => [...prev, newEntry])
    return newEntry
  }, [])

  const updateEntry = useCallback((id, updates) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        const updated = { ...e, ...updates }
        if (updates.startTime || updates.endTime) {
          updated.duration = getDurationMinutes(
            updated.startTime,
            updated.endTime
          )
        }
        return updated
      })
    )
  }, [])

  const deleteEntry = useCallback((id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const getEntriesForDate = useCallback(
    (date) => {
      const key = typeof date === 'string' ? date : getDateKey(date)
      return entries
        .filter((e) => e.date === key)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    },
    [entries]
  )

  const getEntriesForWeek = useCallback(
    (endDate) => {
      const result = {}
      const d = new Date(endDate + 'T12:00:00')
      for (let i = 6; i >= 0; i--) {
        const day = new Date(d)
        day.setDate(day.getDate() - i)
        const key = getDateKey(day)
        const dayEntries = entries.filter((e) => e.date === key)
        if (dayEntries.length > 0) {
          result[key] = dayEntries
        }
      }
      return result
    },
    [entries]
  )

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesForDate,
    getEntriesForWeek,
  }
}
