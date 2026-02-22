import { getCategoryById } from '../utils/categories'

export default function ReminderBanner({ category, onDismiss }) {
  const cat = getCategoryById(category)
  return (
    <div className="mx-4 mt-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
      <p className="text-xs text-amber-700">
        ⏰ Still doing{' '}
        <span className="font-semibold">
          {cat?.emoji} {cat?.label}
        </span>
        ? Timer running 4+ hours.
      </p>
      <button
        onClick={onDismiss}
        className="text-xs text-amber-500 hover:text-amber-700 ml-2 font-medium"
      >
        OK
      </button>
    </div>
  )
}
