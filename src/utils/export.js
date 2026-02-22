import { getCategoryById } from './categories'
import { formatDuration } from './time'
import { generateCategoryBreakdown, generateDailyMetrics } from './insights'

export const exportAsJSON = (entries) => {
  const data = JSON.stringify({ entries, exportedAt: new Date().toISOString() }, null, 2)
  downloadFile(data, 'time-tracker-export.json', 'application/json')
}

export const exportAsMarkdown = (entries, dateRange) => {
  const grouped = {}
  entries.forEach((e) => {
    if (!grouped[e.date]) grouped[e.date] = []
    grouped[e.date].push(e)
  })

  let md = `# Time Tracker Report\n\n`
  md += `**Period:** ${dateRange || 'All entries'}\n`
  md += `**Exported:** ${new Date().toLocaleDateString()}\n\n`

  const sortedDates = Object.keys(grouped).sort()
  for (const date of sortedDates) {
    const dayEntries = grouped[date]
    md += `## ${date}\n\n`

    const metrics = generateDailyMetrics(dayEntries)
    md += `- Total tracked: ${metrics.totalTracked}\n`
    md += `- Core Work: ${metrics.coreWorkHours}\n`
    md += `- Leisure: ${metrics.leisureHours}\n\n`

    md += `| Time | Category | Description | Energy | Duration |\n`
    md += `|------|----------|-------------|--------|----------|\n`

    const sorted = [...dayEntries].sort((a, b) => a.startTime.localeCompare(b.startTime))
    for (const entry of sorted) {
      const cat = getCategoryById(entry.category)
      md += `| ${entry.startTime}–${entry.endTime} | ${cat?.emoji || ''} ${cat?.label || entry.category} | ${entry.description || ''} | ${entry.energy || ''} | ${formatDuration(entry.duration)} |\n`
    }
    md += `\n`

    const breakdown = generateCategoryBreakdown(dayEntries)
    md += `### Category Breakdown\n\n`
    for (const cat of breakdown) {
      md += `- ${cat.emoji} ${cat.label}: ${formatDuration(cat.minutes)} (${cat.percentage}%)\n`
    }
    md += `\n---\n\n`
  }

  downloadFile(md, 'time-tracker-report.md', 'text/markdown')
}

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
