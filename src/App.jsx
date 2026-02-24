import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import QuickEntry from './components/QuickEntry'
import Timeline from './components/Timeline'
import DailySummary from './components/DailySummary'
import WeeklySummary from './components/WeeklySummary'
import EditSheet from './components/EditSheet'
import AddBlockSheet from './components/AddBlockSheet'
import ExportMenu from './components/ExportMenu'
import ReminderBanner from './components/ReminderBanner'
import { useEntries } from './hooks/useEntries'
import { useTimer } from './hooks/useTimer'
import { getDateKey } from './utils/time'

function App() {
  const { entries, addEntry, updateEntry, deleteEntry, getEntriesForDate, getEntriesForWeek } =
    useEntries()

  const [selectedDate, setSelectedDate] = useState(getDateKey(new Date()))
  const [view, setView] = useState('today') // 'today' | 'week'
  const [editingEntry, setEditingEntry] = useState(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [addDefaults, setAddDefaults] = useState({ start: null, end: null })
  const [showExport, setShowExport] = useState(false)
  const [reminderDismissed, setReminderDismissed] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  const showToast = useCallback((message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(message)
    toastTimerRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const onTimerStop = useCallback(
    (entryData) => {
      addEntry(entryData)
      if (!entryData.description?.trim()) {
        showToast('No description — tap the block to add one')
      }
    },
    [addEntry, showToast]
  )

  const { activeTimer, elapsed, startTimer, stopTimer, setDescription, setEnergy, isRunningLong, description, energy } =
    useTimer({ onTimerStop })

  const todayEntries = useMemo(
    () => getEntriesForDate(selectedDate),
    [getEntriesForDate, selectedDate]
  )

  const weekEntries = useMemo(
    () => getEntriesForWeek(selectedDate),
    [getEntriesForWeek, selectedDate]
  )

  const navigateDate = (delta) => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + delta)
    setSelectedDate(getDateKey(d))
  }

  const isToday = selectedDate === getDateKey(new Date())

  const handleAddBlock = (startTime, endTime) => {
    setAddDefaults({ start: startTime || null, end: endTime || null })
    setShowAddSheet(true)
  }

  const handleAddEntry = (data) => {
    addEntry({
      ...data,
      date: selectedDate,
    })
  }

  const handleEditSave = (updates) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, updates)
    }
  }

  const handleEditDelete = () => {
    if (editingEntry) {
      deleteEntry(editingEntry.id)
    }
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-base font-bold">⏱ Time Tracker</h1>
          <button
            onClick={() => setShowExport(true)}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            Export
          </button>
        </div>

        {/* Date nav + View toggle */}
        <div className="px-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate(-1)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              ‹
            </button>
            <button
              onClick={() => setSelectedDate(getDateKey(new Date()))}
              className={`text-sm font-medium ${
                isToday ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {isToday ? 'Today' : selectedDate}
            </button>
            <button
              onClick={() => navigateDate(1)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              ›
            </button>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setView('today')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === 'today'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </header>

      {/* Reminder Banner */}
      {isRunningLong && !reminderDismissed && (
        <ReminderBanner
          category={activeTimer?.category}
          onDismiss={() => setReminderDismissed(true)}
        />
      )}

      {/* Browser reminder for first visit */}
      {entries.length === 0 && !activeTimer && (
        <div className="mx-4 mt-3 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-600">
            💡 For consistent data, always use the same browser. Your data is stored locally in this browser.
          </p>
        </div>
      )}

      {/* Quick Entry - always visible on today */}
      {isToday && (
        <QuickEntry
          activeTimer={activeTimer}
          elapsed={elapsed}
          description={description}
          energy={energy}
          onCategoryTap={startTimer}
          onStopTimer={stopTimer}
          onDescriptionChange={setDescription}
          onEnergyChange={setEnergy}
        />
      )}

      {/* Content based on view */}
      {view === 'today' ? (
        <>
          <Timeline
            entries={todayEntries}
            activeTimer={isToday ? activeTimer : null}
            onEdit={setEditingEntry}
            onDelete={(id) => deleteEntry(id)}
            onAddBlock={handleAddBlock}
          />
          <DailySummary entries={todayEntries} />
        </>
      ) : (
        <WeeklySummary weekEntries={weekEntries} />
      )}

      {/* Sheets */}
      <EditSheet
        entry={editingEntry}
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={handleEditSave}
        onDelete={handleEditDelete}
      />

      <AddBlockSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAdd={handleAddEntry}
        defaultStart={addDefaults.start}
        defaultEnd={addDefaults.end}
      />

      <ExportMenu
        entries={entries}
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
          <div className="bg-gray-800 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg animate-toast">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
