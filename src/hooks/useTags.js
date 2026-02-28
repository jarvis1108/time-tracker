import { useState, useCallback, useEffect } from 'react'

const TAGS_KEY = 'time-tracker-custom-tags'

const loadCustomTags = () => {
  try {
    const raw = localStorage.getItem(TAGS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export const useTags = () => {
  const [customTags, setCustomTags] = useState(loadCustomTags)

  useEffect(() => {
    localStorage.setItem(TAGS_KEY, JSON.stringify(customTags))
  }, [customTags])

  const addTag = useCallback((categoryId, tag) => {
    setCustomTags((prev) => {
      const existing = prev[categoryId] || []
      if (existing.some((t) => t.toLowerCase() === tag.toLowerCase())) return prev
      return { ...prev, [categoryId]: [...existing, tag] }
    })
  }, [])

  const removeTag = useCallback((categoryId, tag) => {
    setCustomTags((prev) => {
      const existing = prev[categoryId] || []
      return { ...prev, [categoryId]: existing.filter((t) => t !== tag) }
    })
  }, [])

  return { customTags, addTag, removeTag }
}
