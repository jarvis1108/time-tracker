export const DEFAULT_TAGS = {
  core_work: ['Apply', 'Interview prep'],
  exploration: ['Planning'],
  side_hustle: ['Daily MS', 'Research MS'],
  fitness: ['Strength training'],
  social: ['Call', 'Reply messages'],
  life_admin: ['Food', '🐶', 'Morning routine', 'Bedtime routine'],
  leisure: ['Phone', 'TV', '👩'],
  rest: ['Sleep', 'Nap'],
}

export function getDescriptionFrequency(entries) {
  const freq = {}
  for (const entry of entries) {
    if (!entry.description?.trim()) continue
    const desc = entry.description.trim()
    if (!freq[entry.category]) freq[entry.category] = {}
    freq[entry.category][desc] = (freq[entry.category][desc] || 0) + 1
  }
  return freq
}

/**
 * Merge custom tags, historical tags (>=minUses), and defaults.
 * Priority: custom first, then historical by frequency desc, then defaults.
 * Deduped by case-insensitive comparison.
 */
export function getMergedTags(categoryId, customTags, frequency, minUses = 2) {
  const seen = new Set()
  const result = []

  const addUnique = (tag) => {
    const key = tag.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push(tag)
    }
  }

  // 1. Custom tags (user-defined order)
  const custom = customTags[categoryId] || []
  custom.forEach(addUnique)

  // 2. Historical tags sorted by frequency (>=minUses)
  const catFreq = frequency[categoryId] || {}
  Object.entries(catFreq)
    .filter(([, count]) => count >= minUses)
    .sort(([, a], [, b]) => b - a)
    .map(([desc]) => desc)
    .forEach(addUnique)

  // 3. Defaults
  const defaults = DEFAULT_TAGS[categoryId] || []
  defaults.forEach(addUnique)

  return result
}
