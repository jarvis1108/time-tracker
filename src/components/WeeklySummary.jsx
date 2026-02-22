import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { CATEGORIES } from '../utils/categories'
import {
  generateWeeklyInsights,
  generateEnergyCorrelation,
} from '../utils/insights'
import { formatDuration } from '../utils/time'

export default function WeeklySummary({ weekEntries }) {
  const days = Object.keys(weekEntries)
  if (days.length < 2) return null

  const chartData = useMemo(() => {
    return days.sort().map((date) => {
      const entries = weekEntries[date]
      const row = { date: date.slice(5) } // MM-DD
      CATEGORIES.forEach((cat) => {
        const minutes = entries
          .filter((e) => e.category === cat.id)
          .reduce((s, e) => s + (e.duration || 0), 0)
        row[cat.id] = Math.round(minutes / 60 * 10) / 10 // hours with 1 decimal
      })
      return row
    })
  }, [weekEntries, days])

  const weeklyTotals = useMemo(() => {
    const totals = {}
    const allEntries = Object.values(weekEntries).flat()
    CATEGORIES.forEach((cat) => {
      const minutes = allEntries
        .filter((e) => e.category === cat.id)
        .reduce((s, e) => s + (e.duration || 0), 0)
      if (minutes > 0) {
        totals[cat.id] = { ...cat, minutes }
      }
    })
    return Object.values(totals).sort((a, b) => b.minutes - a.minutes)
  }, [weekEntries])

  const insights = useMemo(() => generateWeeklyInsights(weekEntries), [weekEntries])
  const energyData = useMemo(() => {
    const allEntries = Object.values(weekEntries).flat()
    return generateEnergyCorrelation(allEntries)
  }, [weekEntries])

  return (
    <div className="px-4 py-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Weekly Summary
      </h2>

      {/* Stacked bar chart */}
      <div className="bg-gray-50 rounded-xl p-3 mb-3">
        <p className="text-xs text-gray-500 mb-2">Hours per day by category</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={30} />
            <Tooltip
              formatter={(value, name) => {
                const cat = CATEGORIES.find((c) => c.id === name)
                return [`${value}h`, cat?.label || name]
              }}
            />
            {CATEGORIES.map((cat) => (
              <Bar
                key={cat.id}
                dataKey={cat.id}
                stackId="a"
                fill={cat.color}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly totals */}
      <div className="bg-gray-50 rounded-xl p-3 mb-3">
        <p className="text-xs text-gray-500 mb-2">Weekly Totals</p>
        <div className="space-y-1.5">
          {weeklyTotals.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm">
                  {cat.emoji} {cat.label}
                </span>
              </div>
              <span className="text-sm font-medium">{formatDuration(cat.minutes)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-3 mb-3">
          <p className="text-xs font-semibold text-blue-700 mb-1.5">💡 Insights</p>
          {insights.map((insight, i) => (
            <p key={i} className="text-xs text-blue-600 mb-1">
              • {insight}
            </p>
          ))}
        </div>
      )}

      {/* Energy correlation */}
      {energyData.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-2">Energy by Category</p>
          <div className="space-y-1.5">
            {energyData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{item.category}</span>
                <div className="flex gap-2 text-xs">
                  {item.high > 0 && (
                    <span className="text-green-600">⬆️ {item.high}</span>
                  )}
                  {item.low > 0 && (
                    <span className="text-orange-600">⬇️ {item.low}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
