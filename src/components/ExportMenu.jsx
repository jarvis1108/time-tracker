import { useState, useMemo, useEffect } from 'react'
import BottomSheet from './BottomSheet'
import { exportAsJSON, exportAsMarkdown } from '../utils/export'
import { getDateKey } from '../utils/time'

export default function ExportMenu({ entries, isOpen, onClose }) {
  const allDates = useMemo(() => {
    const dates = entries.map((e) => e.date).sort()
    return {
      min: dates[0] || getDateKey(new Date()),
      max: dates[dates.length - 1] || getDateKey(new Date()),
    }
  }, [entries])

  const [startDate, setStartDate] = useState(allDates.min)
  const [endDate, setEndDate] = useState(allDates.max)

  // Reset dates when menu opens
  useEffect(() => {
    if (isOpen) {
      setStartDate(allDates.min)
      setEndDate(allDates.max)
    }
  }, [isOpen, allDates])

  // Quick presets
  const today = getDateKey(new Date())
  const weekAgo = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 6)
    return getDateKey(d)
  })()

  const setPreset = (preset) => {
    if (preset === 'today') {
      setStartDate(today)
      setEndDate(today)
    } else if (preset === 'week') {
      setStartDate(weekAgo)
      setEndDate(today)
    } else {
      setStartDate(allDates.min)
      setEndDate(allDates.max)
    }
  }

  const activePreset =
    startDate === today && endDate === today
      ? 'today'
      : startDate === weekAgo && endDate === today
        ? 'week'
        : startDate === allDates.min && endDate === allDates.max
          ? 'all'
          : null

  const filteredEntries = useMemo(
    () => entries.filter((e) => e.date >= startDate && e.date <= endDate),
    [entries, startDate, endDate]
  )

  const dateRange = `${startDate} to ${endDate}`

  const handleExportJSON = () => {
    exportAsJSON(filteredEntries, startDate, endDate)
    onClose()
  }

  const handleExportMarkdown = () => {
    exportAsMarkdown(filteredEntries, dateRange, startDate, endDate)
    onClose()
  }

  const hasEntries = filteredEntries.length > 0

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Export Data">
      <div className="space-y-3 mt-2">
        {/* Quick presets */}
        <div className="flex gap-2">
          {[
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'all', label: 'All' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPreset(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activePreset === key
                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Date range inputs */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-0.5 block">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
              className="w-full px-2.5 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <span className="text-gray-300 mt-4">–</span>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-0.5 block">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full px-2.5 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Export buttons */}
        <button
          onClick={handleExportJSON}
          disabled={!hasEntries}
          className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
            hasEntries
              ? 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'
              : 'bg-gray-50 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">📦 Export as JSON</p>
            <span className="text-xs text-gray-400">
              {filteredEntries.length} entries
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Full data dump for analysis in other tools
          </p>
        </button>
        <button
          onClick={handleExportMarkdown}
          disabled={!hasEntries}
          className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
            hasEntries
              ? 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'
              : 'bg-gray-50 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">📝 Export as Markdown</p>
            <span className="text-xs text-gray-400">
              {filteredEntries.length} entries
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Formatted report for notes or conversations
          </p>
        </button>

        {!hasEntries && (
          <p className="text-xs text-gray-400 text-center">
            No entries in selected range
          </p>
        )}
      </div>
    </BottomSheet>
  )
}
