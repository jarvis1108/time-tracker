import { useMemo } from 'react'
import TimeBlock from './TimeBlock'
import { findGaps, parseTimeToMinutes, minutesToTime, formatDuration } from '../utils/time'

export default function Timeline({ entries, activeTimer, onEdit, onDelete, onAddBlock }) {
  const gaps = useMemo(() => findGaps(entries), [entries])

  const allItems = useMemo(() => {
    const items = [
      ...entries.map((e) => ({ type: 'entry', data: e, startMin: parseTimeToMinutes(e.startTime) })),
      ...gaps.map((g) => ({ type: 'gap', data: g, startMin: parseTimeToMinutes(g.startTime) })),
    ]
    return items.sort((a, b) => a.startMin - b.startMin)
  }, [entries, gaps])

  if (entries.length === 0 && !activeTimer) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-4xl mb-3">⏱️</p>
        <p className="text-gray-500 text-sm">No entries yet today</p>
        <p className="text-gray-400 text-xs mt-1">Tap a category above to start tracking</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Timeline</h2>
        <button
          onClick={onAddBlock}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 active:text-blue-800"
        >
          + Add Block
        </button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gray-200" />

        <div className="space-y-1">
          {allItems.map((item, i) => {
            if (item.type === 'gap') {
              return (
                <div
                  key={`gap-${i}`}
                  onClick={() =>
                    onAddBlock(item.data.startTime, item.data.endTime)
                  }
                  className="flex items-center gap-3 py-2 pl-[22px] cursor-pointer group"
                >
                  <div className="w-[11px] h-[11px] rounded-full border-2 border-dashed border-gray-300 flex-shrink-0" />
                  <div className="flex-1 text-xs text-gray-400 group-hover:text-gray-600">
                    <span className="font-medium">
                      {item.data.startTime} – {item.data.endTime}
                    </span>
                    <span className="ml-2">
                      Gap · {formatDuration(item.data.duration)}
                    </span>
                  </div>
                </div>
              )
            }
            return (
              <TimeBlock
                key={item.data.id}
                entry={item.data}
                onEdit={() => onEdit(item.data)}
                onDelete={() => onDelete(item.data.id)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
