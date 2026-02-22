export const formatTime = (date) => {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export const formatDuration = (minutes) => {
  if (minutes < 1) return '<1m'
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export const formatElapsed = (ms) => {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export const getDateKey = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const parseTimeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

export const minutesToTime = (minutes) => {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0')
  const m = String(minutes % 60).padStart(2, '0')
  return `${h}:${m}`
}

export const getDurationMinutes = (startTime, endTime) => {
  return parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime)
}

export const splitAtMidnight = (entry) => {
  if (entry.endTime > entry.startTime) return [entry]
  // Entry crosses midnight
  return [
    { ...entry, endTime: '23:59', duration: getDurationMinutes(entry.startTime, '23:59') + 1 },
    {
      ...entry,
      id: crypto.randomUUID(),
      date: getNextDate(entry.date),
      startTime: '00:00',
      duration: getDurationMinutes('00:00', entry.endTime),
    },
  ]
}

const getNextDate = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + 1)
  return getDateKey(d)
}

export const findGaps = (entries, minGapMinutes = 15) => {
  if (entries.length < 2) return []
  const sorted = [...entries].sort(
    (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)
  )
  const gaps = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const gapStart = sorted[i].endTime
    const gapEnd = sorted[i + 1].startTime
    const gapMinutes = getDurationMinutes(gapStart, gapEnd)
    if (gapMinutes >= minGapMinutes) {
      gaps.push({ startTime: gapStart, endTime: gapEnd, duration: gapMinutes })
    }
  }
  return gaps
}
