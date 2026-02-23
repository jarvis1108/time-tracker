import { CATEGORIES } from '../utils/categories'
import { formatElapsed } from '../utils/time'

export default function QuickEntry({
  activeTimer,
  elapsed,
  description,
  energy,
  onCategoryTap,
  onStopTimer,
  onDescriptionChange,
  onEnergyChange,
}) {
  const handleEnergyToggle = (level) => {
    onEnergyChange(energy === level ? null : level)
  }

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Active Timer Display */}
      {activeTimer && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full animate-pulse-dot"
              style={{
                backgroundColor:
                  CATEGORIES.find((c) => c.id === activeTimer.category)?.color || '#999',
              }}
            />
            <span className="text-sm font-medium text-gray-600">
              {CATEGORIES.find((c) => c.id === activeTimer.category)?.emoji}{' '}
              {CATEGORIES.find((c) => c.id === activeTimer.category)?.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-semibold tabular-nums">
              {formatElapsed(elapsed)}
            </span>
            <button
              onClick={onStopTimer}
              className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CATEGORIES.map((cat) => {
          const isActive = activeTimer?.category === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryTap(cat.id)}
              className="relative flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all active:scale-95"
              style={{
                backgroundColor: isActive ? cat.color : `${cat.color}12`,
                color: isActive ? '#fff' : cat.color,
                borderWidth: 2,
                borderColor: isActive ? cat.color : 'transparent',
              }}
            >
              <span className="text-2xl mb-1">{cat.emoji}</span>
              <span className="text-xs font-semibold tracking-wide">{cat.label}</span>
              {isActive && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white animate-pulse-dot" />
              )}
            </button>
          )
        })}
      </div>

      {/* Description + Energy */}
      {activeTimer && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="What are you working on?"
            className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
          <button
            onClick={() => handleEnergyToggle('high')}
            className={`px-2 py-1.5 text-sm rounded-lg transition-colors ${
              energy === 'high'
                ? 'bg-green-100 text-green-700 ring-1 ring-green-300'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}
          >
            ⬆️
          </button>
          <button
            onClick={() => handleEnergyToggle('low')}
            className={`px-2 py-1.5 text-sm rounded-lg transition-colors ${
              energy === 'low'
                ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-300'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}
          >
            ⬇️
          </button>
        </div>
      )}
    </div>
  )
}
