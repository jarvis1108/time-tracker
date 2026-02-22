import { useState, useEffect } from 'react'
import BottomSheet from './BottomSheet'
import { CATEGORIES } from '../utils/categories'

export default function EditSheet({ entry, isOpen, onClose, onSave, onDelete }) {
  const [startTime, setStartTime] = useState(entry?.startTime || '00:00')
  const [endTime, setEndTime] = useState(entry?.endTime || '00:00')
  const [category, setCategory] = useState(entry?.category || 'core_work')
  const [description, setDescription] = useState(entry?.description || '')
  const [energy, setEnergy] = useState(entry?.energy || null)

  // Reset form when entry changes
  useEffect(() => {
    if (entry) {
      setStartTime(entry.startTime)
      setEndTime(entry.endTime)
      setCategory(entry.category)
      setDescription(entry.description || '')
      setEnergy(entry.energy || null)
    }
  }, [entry])

  const handleSave = () => {
    onSave({
      startTime,
      endTime,
      category,
      description,
      energy,
    })
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Edit Block">
      <div className="space-y-4 mt-2">
        {/* Time inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Start</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">End</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
          <div className="grid grid-cols-4 gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className="flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-all"
                style={{
                  backgroundColor:
                    category === cat.id ? cat.color : `${cat.color}12`,
                  color: category === cat.id ? '#fff' : cat.color,
                }}
              >
                <span className="text-base">{cat.emoji}</span>
                <span className="font-medium mt-0.5 truncate w-full text-center" style={{ fontSize: '10px' }}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional note..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Energy */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Energy</label>
          <div className="flex gap-2">
            <button
              onClick={() => setEnergy(energy === 'high' ? null : 'high')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                energy === 'high'
                  ? 'bg-green-100 text-green-700 ring-1 ring-green-300'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              ⬆️ High
            </button>
            <button
              onClick={() => setEnergy(energy === 'low' ? null : 'low')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                energy === 'low'
                  ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-300'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              ⬇️ Low
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onDelete && (
            <button
              onClick={() => {
                onDelete()
                onClose()
              }}
              className="px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
