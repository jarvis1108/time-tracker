import { useState, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'
import { getCategoryById } from '../utils/categories'
import { formatDuration } from '../utils/time'

export default function TimeBlock({ entry, onEdit, onDelete }) {
  const [offsetX, setOffsetX] = useState(0)
  const [showDelete, setShowDelete] = useState(false)
  const deleteThreshold = -80
  const containerRef = useRef(null)

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (e.dir === 'Left') {
        setOffsetX(Math.max(e.deltaX, -120))
      }
    },
    onSwipedLeft: (e) => {
      if (e.deltaX < deleteThreshold) {
        setShowDelete(true)
        setOffsetX(-80)
      } else {
        setOffsetX(0)
        setShowDelete(false)
      }
    },
    onSwipedRight: () => {
      setOffsetX(0)
      setShowDelete(false)
    },
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
  })

  const cat = getCategoryById(entry.category)
  const heightScale = Math.max(40, Math.min(entry.duration * 0.8, 120))

  const handleDelete = () => {
    onDelete()
    setOffsetX(0)
    setShowDelete(false)
  }

  return (
    <div className="relative overflow-hidden rounded-lg" ref={containerRef}>
      {/* Delete background */}
      {showDelete && (
        <button
          onClick={handleDelete}
          className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 text-white text-xs font-semibold flex items-center justify-center z-0"
        >
          Delete
        </button>
      )}

      <div
        {...handlers}
        onClick={() => {
          if (!showDelete) onEdit()
        }}
        className="relative flex items-start gap-3 py-2 pl-[22px] pr-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-all z-10 bg-white"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: offsetX === 0 ? 'transform 0.2s ease-out' : 'none',
          minHeight: `${heightScale}px`,
        }}
      >
        {/* Dot */}
        <div
          className="w-[11px] h-[11px] rounded-full flex-shrink-0 mt-1"
          style={{ backgroundColor: cat?.color || '#999' }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">
              {entry.startTime} – {entry.endTime}
            </span>
            <span className="text-xs text-gray-400">
              {formatDuration(entry.duration)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span>{cat?.emoji}</span>
            <span className="text-sm font-medium" style={{ color: cat?.color }}>
              {cat?.label}
            </span>
            {entry.energy && (
              <span className="text-xs">
                {entry.energy === 'high' ? '⬆️' : '⬇️'}
              </span>
            )}
          </div>
          {entry.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{entry.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
