export const CATEGORIES = [
  { id: 'core_work', emoji: '🎯', label: 'Core Work', color: '#2563EB' },
  { id: 'exploration', emoji: '🔧', label: 'Exploration', color: '#60A5FA' },
  { id: 'side_hustle', emoji: '💰', label: 'Side Hustle', color: '#F59E0B' },
  { id: 'fitness', emoji: '🏃', label: 'Fitness', color: '#22C55E' },
  { id: 'social', emoji: '👥', label: 'Social', color: '#A855F7' },
  { id: 'life_admin', emoji: '🍳', label: 'Life Admin', color: '#F97316' },
  { id: 'leisure', emoji: '🎮', label: 'Leisure', color: '#EF4444' },
  { id: 'rest', emoji: '😴', label: 'Rest', color: '#9CA3AF' },
]

export const getCategoryById = (id) => CATEGORIES.find((c) => c.id === id)
