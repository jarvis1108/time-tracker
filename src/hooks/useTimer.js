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
  const descriptionRef = useRef('')
  const energyRef = useRef(null)

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
        // Split at midnight: end the old entry at 23:59, start new one at 00:00
        const endOfDay = new Date(activeTimer.startedAt)
        endOfDay.setHours(23, 59, 0, 0)
        onTimerStop({
          category: activeTimer.category,
          date: timerDate,
          startTime: formatTime(new Date(activeTimer.startedAt)),
          endTime: '23:59',
          description: descriptionRef.current,
          energy: energyRef.current,
        })
        // Start new timer at midnight for current day
        const midnightStart = new Date(now)
        midnightStart.setHours(0, 0, 0, 0)
        setActiveTimer({
          category: activeTimer.category,
          startedAt: midnightStart.getTime(),
        })
      }
    }
    const midnightCheck = setInterval(checkMidnight, 60000)
    return () => clearInterval(midnightCheck)
  }, [activeTimer, onTimerStop])

  const startTimer = useCallback(
    (category) => {
      // Stop previous timer first
      if (activeTimer) {
        const now = new Date()
        onTimerStop({
          category: activeTimer.category,
          date: getDateKey(new Date(activeTimer.startedAt)),
          startTime: formatTime(new Date(activeTimer.startedAt)),
          endTime: formatTime(now),
          description: descriptionRef.current,
          energy: energyRef.current,
        })
        // Reset description and energy for new timer
        descriptionRef.current = ''
        energyRef.current = null
      }
      setActiveTimer({
        category,
        startedAt: Date.now(),
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
      description: descriptionRef.current,
      energy: energyRef.current,
    })
    descriptionRef.current = ''
    energyRef.current = null
    setActiveTimer(null)
  }, [activeTimer, onTimerStop])

  const setDescription = useCallback((desc) => {
    descriptionRef.current = desc
  }, [])

  const setEnergy = useCallback((energy) => {
    energyRef.current = energy
  }, [])

  const isRunningLong = activeTimer && elapsed > 4 * 60 * 60 * 1000 // >4 hours

  return {
    activeTimer,
    elapsed,
    startTimer,
    stopTimer,
    setDescription,
    setEnergy,
    isRunningLong,
    description: descriptionRef.current,
    energy: energyRef.current,
  }
}
