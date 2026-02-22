import { useState } from 'react'
import BottomSheet from './BottomSheet'
import { exportAsJSON, exportAsMarkdown } from '../utils/export'

export default function ExportMenu({ entries, isOpen, onClose }) {
  const handleExportJSON = () => {
    exportAsJSON(entries)
    onClose()
  }

  const handleExportMarkdown = () => {
    const dates = entries.map((e) => e.date).sort()
    const range = dates.length > 0 ? `${dates[0]} to ${dates[dates.length - 1]}` : ''
    exportAsMarkdown(entries, range)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Export Data">
      <div className="space-y-2 mt-2">
        <button
          onClick={handleExportJSON}
          className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <p className="text-sm font-medium">📦 Export as JSON</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Full data dump for analysis in other tools
          </p>
        </button>
        <button
          onClick={handleExportMarkdown}
          className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <p className="text-sm font-medium">📝 Export as Markdown</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Formatted report for notes or conversations
          </p>
        </button>
        <p className="text-xs text-gray-400 text-center pt-2">
          {entries.length} entries total
        </p>
      </div>
    </BottomSheet>
  )
}
