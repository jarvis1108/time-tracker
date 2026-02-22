import { getCategoryById } from './categories'
import { parseTimeToMinutes, formatDuration } from './time'

export const generateDailyMetrics = (entries) => {
  const totalMinutes = entries.reduce((sum, e) => sum + (e.duration || 0), 0)
  const coreWork = entries
    .filter((e) => e.category === 'core_work')
    .reduce((sum, e) => sum + (e.duration || 0), 0)
  const leisure = entries
    .filter((e) => e.category === 'leisure')
    .reduce((sum, e) => sum + (e.duration || 0), 0)

  const coreBlocks = entries
    .filter((e) => e.category === 'core_work')
    .map((e) => e.duration || 0)
  const longestCoreBlock = coreBlocks.length > 0 ? Math.max(...coreBlocks) : 0

  const sorted = [...entries].sort(
    (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)
  )
  const firstCore = sorted.find((e) => e.category === 'core_work')
  const firstEntry = sorted[0]
  const wakeToCore =
    firstCore && firstEntry
      ? parseTimeToMinutes(firstCore.startTime) - parseTimeToMinutes(firstEntry.startTime)
      : null

  return {
    totalTracked: formatDuration(totalMinutes),
    coreWorkHours: formatDuration(coreWork),
    leisureHours: formatDuration(leisure),
    longestCoreBlock: formatDuration(longestCoreBlock),
    wakeToCore: wakeToCore !== null ? formatDuration(wakeToCore) : 'N/A',
  }
}

export const generateCategoryBreakdown = (entries) => {
  const totals = {}
  entries.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + (e.duration || 0)
  })
  const totalMinutes = Object.values(totals).reduce((a, b) => a + b, 0)
  return Object.entries(totals)
    .map(([categoryId, minutes]) => {
      const cat = getCategoryById(categoryId)
      return {
        id: categoryId,
        label: cat?.label || categoryId,
        emoji: cat?.emoji || '',
        color: cat?.color || '#999',
        minutes,
        percentage: totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0,
      }
    })
    .sort((a, b) => b.minutes - a.minutes)
}

export const generateWeeklyInsights = (weekEntries) => {
  const insights = []
  const allEntries = Object.values(weekEntries).flat()
  const days = Object.keys(weekEntries).length

  if (days === 0) return insights

  const coreTotal = allEntries
    .filter((e) => e.category === 'core_work')
    .reduce((s, e) => s + (e.duration || 0), 0)
  const coreAvg = coreTotal / days
  if (coreAvg < 180) {
    insights.push(
      `Your Core Work averaged ${formatDuration(coreAvg)}/day — below the 3-4h target`
    )
  } else {
    insights.push(`Great focus! Core Work averaged ${formatDuration(coreAvg)}/day`)
  }

  const sideHustle = allEntries
    .filter((e) => e.category === 'side_hustle')
    .reduce((s, e) => s + (e.duration || 0), 0)
  if (sideHustle > coreTotal) {
    insights.push('Side Hustle consumed more time than Core Work this week')
  }

  // Check first core work time pattern
  const firstCoreTimes = Object.values(weekEntries)
    .map((dayEntries) => {
      const sorted = [...dayEntries].sort(
        (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)
      )
      const first = sorted.find((e) => e.category === 'core_work')
      return first ? parseTimeToMinutes(first.startTime) : null
    })
    .filter(Boolean)

  if (firstCoreTimes.length > 0) {
    const avgStartMinutes = firstCoreTimes.reduce((a, b) => a + b, 0) / firstCoreTimes.length
    if (avgStartMinutes >= 660) {
      insights.push("You rarely start Core Work before 11 AM")
    }
  }

  // Check leisure patterns
  const leisureEntries = allEntries.filter((e) => e.category === 'leisure')
  const eveningLeisure = leisureEntries.filter((e) => {
    const start = parseTimeToMinutes(e.startTime)
    return start >= 1140 && start <= 1320 // 7-10 PM
  })
  if (eveningLeisure.length > leisureEntries.length * 0.5 && leisureEntries.length > 3) {
    insights.push('Leisure time peaks in the evening (7-10 PM)')
  }

  return insights
}

export const generateEnergyCorrelation = (entries) => {
  const correlation = {}
  entries.forEach((e) => {
    if (!e.energy) return
    if (!correlation[e.category]) {
      correlation[e.category] = { high: 0, low: 0 }
    }
    correlation[e.category][e.energy]++
  })
  return Object.entries(correlation).map(([categoryId, counts]) => {
    const cat = getCategoryById(categoryId)
    return {
      category: cat?.label || categoryId,
      color: cat?.color || '#999',
      high: counts.high,
      low: counts.low,
    }
  })
}
