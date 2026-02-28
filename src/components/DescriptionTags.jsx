import { useState, useRef, useCallback } from 'react'

export default function DescriptionTags({ tags, categoryId, onSelectTag, onAddTag, onRemoveTag }) {
  const [deletingTag, setDeletingTag] = useState(null)
  const longPressTimer = useRef(null)
  const touchMoved = useRef(false)

  const handleTouchStart = useCallback((tag) => {
    touchMoved.current = false
    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null
      setDeletingTag(tag)
    }, 500)
  }, [])

  const handleTouchMove = useCallback(() => {
    touchMoved.current = true
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchEnd = useCallback(
    (tag) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
      if (deletingTag) return
      if (touchMoved.current) return
      onSelectTag(tag)
    },
    [deletingTag, onSelectTag],
  )

  const handleConfirmDelete = useCallback(
    (e, tag) => {
      e.stopPropagation()
      onRemoveTag(categoryId, tag)
      setDeletingTag(null)
    },
    [categoryId, onRemoveTag],
  )

  const handleAddCustom = () => {
    const newTag = window.prompt('New tag:')
    if (newTag?.trim()) {
      onAddTag(categoryId, newTag.trim())
    }
  }

  // Dismiss delete mode when tapping outside
  const handleContainerClick = useCallback(() => {
    if (deletingTag) setDeletingTag(null)
  }, [deletingTag])

  if (!tags.length && !onAddTag) return null

  return (
    <div
      className="flex gap-1.5 overflow-x-auto py-1 scrollbar-hide"
      onClick={handleContainerClick}
    >
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onTouchStart={() => handleTouchStart(tag)}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => handleTouchEnd(tag)}
          onClick={() => {
            if (!('ontouchstart' in window)) {
              if (deletingTag === tag) return
              onSelectTag(tag)
            }
          }}
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full active:bg-gray-300 transition-colors whitespace-nowrap"
        >
          {tag}
          {deletingTag === tag && (
            <span
              onClick={(e) => handleConfirmDelete(e, tag)}
              className="ml-0.5 text-red-400 active:text-red-600"
            >
              ✕
            </span>
          )}
        </button>
      ))}
      <button
        type="button"
        onClick={handleAddCustom}
        className="flex-shrink-0 px-2.5 py-1 text-xs text-gray-400 bg-gray-50 rounded-full active:bg-gray-200 transition-colors"
      >
        +
      </button>
    </div>
  )
}
