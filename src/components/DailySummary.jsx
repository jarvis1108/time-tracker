import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import { generateDailyMetrics, generateCategoryBreakdown } from '../utils/insights'
import { findGaps, formatDuration } from '../utils/time'

export default function DailySummary({ entries }) {
  const metrics = useMemo(() => generateDailyMetrics(entries), [entries])
  const breakdown = useMemo(() => generateCategoryBreakdown(entries), [entries])
  const gaps = useMemo(() => findGaps(entries), [entries])

  if (entries.length === 0) return null

  return (
    <div className="px-4 py-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Daily Summary
      </h2>

      {/* Stacked bar */}
      <div className="bg-gray-50 rounded-xl p-3 mb-3">
        <div className="h-6 rounded-full overflow-hidden flex">
          {breakdown.map((cat) => (
            <div
              key={cat.id}
              style={{
                backgroundColor: cat.color,
                width: `${cat.percentage}%`,
              }}
              title={`${cat.label}: ${cat.percentage}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
          {breakdown.map((cat) => (
            <div key={cat.id} className="flex items-center gap-1 text-xs text-gray-600">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span>
                {cat.emoji} {cat.label}
              </span>
              <span className="text-gray-400">
                {formatDuration(cat.minutes)} ({cat.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard label="Total Tracked" value={metrics.totalTracked} />
        <MetricCard label="Core Work" value={metrics.coreWorkHours} highlight />
        <MetricCard label="Leisure" value={metrics.leisureHours} />
        <MetricCard label="Longest Core Block" value={metrics.longestCoreBlock} />
        <MetricCard label="Wake → Core Work" value={metrics.wakeToCore} />
      </div>

      {/* Gaps */}
      {gaps.length > 0 && (
        <div className="mt-3 p-3 bg-amber-50 rounded-xl">
          <p className="text-xs font-semibold text-amber-700 mb-1.5">
            ⚠ Untracked Gaps ({gaps.length})
          </p>
          {gaps.map((gap, i) => (
            <p key={i} className="text-xs text-amber-600">
              {gap.startTime} – {gap.endTime} ({formatDuration(gap.duration)})
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, highlight }) {
  return (
    <div
      className={`rounded-xl p-3 ${
        highlight ? 'bg-blue-50' : 'bg-gray-50'
      }`}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-lg font-semibold mt-0.5 ${
          highlight ? 'text-blue-600' : 'text-gray-900'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
