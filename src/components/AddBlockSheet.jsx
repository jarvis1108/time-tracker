import { useState, useEffect } from 'react'
import BottomSheet from './BottomSheet'
import { CATEGORIES } from '../utils/categories'
import { formatTime } from '../utils/time'

export default function AddBlockSheet({ isOpen, onClose, onAdd, defaultStart, defaultEnd }) {
  const [startTime, setStartTime] = useState(defaultStart || formatTime(new Date()))
  const [endTime, setEndTime] = useState(defaultEnd || formatTime(new Date()))
  const [category, setCategory] = useState('core_work')
  const [description, setDescription] = useState('')
  const [energy, setEnergy] = useState(null)

  // Reset when sheet opens with new defaults
  useEffect(() => {
    if (isOpen) {
      setStartTime(defaultStart || formatTime(new Date()))
      setEndTime(defaultEnd || formatTime(new Date()))
      setCategory('core_work')
      setDescription('')
      setEnergy(null)
    }
  }, [isOpen, defaultStart, defaultEnd])

  const handleAdd = () => {
    onAdd({
      startTime,
      endTime,
      category,
      description,
      energy,
    })
    // Reset form
    setDescription('')
    setEnergy(null)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Block">
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

        {/* Add button */}
        <button
          onClick={handleAdd}
          className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Add Block
        </button>
      </div>
    </BottomSheet>
  )
}
