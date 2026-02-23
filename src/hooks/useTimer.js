import { useState, useCallback, useEffect, useRef } from 'react'
import { formatTime, getDateKey } from '../utils/time'

const TIMER_KEY = 'time-tracker-active-timer'

const loadTimer = () => {
  try {
    const raw = localStorage.getItem(TIMER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const saveTimer = (timer) => {
  if (timer) {
    localStorage.setItem(TIMER_KEY, JSON.stringify(timer))
  } else {
    localStorage.removeItem(TIMER_KEY)
  }
}

export const useTimer = ({ onTimerStop }) => {
  const [activeTimer, setActiveTimer] = useState(loadTimer)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  // Description and energy are part of activeTimer state now
  const description = activeTimer?.description || ''
  const energy = activeTimer?.energy || null

  // Calculate elapsed time
  useEffect(() => {
    if (activeTimer) {
      const updateElapsed = () => {
        setElapsed(Date.now() - activeTimer.startedAt)
      }
      updateElapsed()
      intervalRef.current = setInterval(updateElapsed, 1000)
      return () => clearInterval(intervalRef.current)
    } else {
      setElapsed(0)
    }
  }, [activeTimer])

  // Persist timer state
  useEffect(() => {
    saveTimer(activeTimer)
  }, [activeTimer])

  // Check for midnight crossover
  useEffect(() => {
    if (!activeTimer) return
    const checkMidnight = () => {
      const now = new Date()
      const timerDate = getDateKey(new Date(activeTimer.startedAt))
      const currentDate = getDateKey(now)
      if (timerDate !== currentDate) {
        onTimerStop({
          category: activeTimer.category,
          date: timerDate,
          startTime: formatTime(new Date(activeTimer.startedAt)),
          endTime: '23:59',
          description: activeTimer.description || '',
          energy: activeTimer.energy || null,
        })
        const midnightStart = new Date(now)
        midnightStart.setHours(0, 0, 0, 0)
        setActiveTimer({
          category: activeTimer.category,
          startedAt: midnightStart.getTime(),
          description: activeTimer.description || '',
          energy: activeTimer.energy || null,
        })
      }
    }
    const midnightCheck = setInterval(checkMidnight, 60000)
    return () => clearInterval(midnightCheck)
  }, [activeTimer, onTimerStop])

  const startTimer = useCallback(
    (category) => {
      if (activeTimer) {
        const now = new Date()
        onTimerStop({
          category: activeTimer.category,
          date: getDateKey(new Date(activeTimer.startedAt)),
          startTime: formatTime(new Date(activeTimer.startedAt)),
          endTime: formatTime(now),
          description: activeTimer.description || '',
          energy: activeTimer.energy || null,
        })
      }
      setActiveTimer({
        category,
        startedAt: Date.now(),
        description: '',
        energy: null,
      })
    },
    [activeTimer, onTimerStop]
  )

  const stopTimer = useCallback(() => {
    if (!activeTimer) return
    const now = new Date()
    onTimerStop({
      category: activeTimer.category,
      date: getDateKey(new Date(activeTimer.startedAt)),
      startTime: formatTime(new Date(activeTimer.startedAt)),
      endTime: formatTime(now),
      description: activeTimer.description || '',
      energy: activeTimer.energy || null,
    })
    setActiveTimer(null)
  }, [activeTimer, onTimerStop])

  const setDescription = useCallback((desc) => {
    setActiveTimer((prev) => prev ? { ...prev, description: desc } : prev)
  }, [])

  const setEnergy = useCallback((val) => {
    setActiveTimer((prev) => prev ? { ...prev, energy: val } : prev)
  }, [])

  const isRunningLong = activeTimer && elapsed > 4 * 60 * 60 * 1000

  return {
    activeTimer,
    elapsed,
    startTimer,
    stopTimer,
    setDescription,
    setEnergy,
    isRunningLong,
    description,
    energy,
  }
}
