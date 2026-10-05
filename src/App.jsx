import { useState, useEffect, useRef } from 'react'

// LocalStorage key name
const STORAGE_KEY = 'todo_app_tasks'

// Initial data fetch URL
const API_URL = 'https://jsonplaceholder.typicode.com/todos'

// Number of tasks to display per page
const ITEMS_PER_PAGE = 50

export default function App() {
  // 1. States
  // Initialize todos from LocalStorage if available
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    try {
      return JSON.parse(saved)
    } catch {
      return []
    }
  })

  const [inputText, setInputText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const taskListRef = useRef(null)

  // Show loading if localStorage has no tasks
  const [loading, setLoading] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return true
    try {
      return JSON.parse(saved).length === 0
    } catch {
      return true
    }
  })

  // Helper function to sync state with LocalStorage
  const saveTodos = (newTodos) => {
    setTodos(newTodos)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos))
  }

  // 2. Fetch from API on initial load if LocalStorage is empty
  useEffect(() => {
    let parsed
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      parsed = saved ? JSON.parse(saved) : []
    } catch {
      parsed = []
    }

    if (parsed.length === 0) {
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
          const initialTasks = data.map((item) => ({
            id: item.id,
            title: item.title,
            completed: item.completed,
          }))
          saveTodos(initialTasks)
        })
        .catch((err) => {
          console.error('Error fetching initial data:', err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [])

  // Manual reload from API when button is clicked
  const handleLoadFromApi = () => {
    setLoading(true)
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const initialTasks = data.map((item) => ({
          id: item.id,
          title: item.title,
          completed: item.completed,
        }))
        saveTodos(initialTasks)
        setCurrentPage(1)
      })
      .catch((err) => {
        console.error('Error fetching data:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 3. Add Todo
  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newTask = {
      id: Date.now(),
      title: inputText.trim(),
      completed: false,
    }

    saveTodos([newTask, ...todos])
    setInputText('')
    setCurrentPage(1) // Return to first page so the user sees the newly added task
    if (taskListRef.current) {
      taskListRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // 4. Toggle Complete / Incomplete
  const handleToggleTodo = (id) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    saveTodos(updated)
  }

  // 5. Delete Todo
  const handleDeleteTodo = (id) => {
    const updated = todos.filter((todo) => todo.id !== id)
    saveTodos(updated)
    const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE) || 1
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages)
    }
  }

  // 6. Pagination calculations
  const totalPages = Math.ceil(todos.length / ITEMS_PER_PAGE) || 1
  const activePage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTodos = todos.slice(startIndex, endIndex)

  // Change page and scroll to top of task list
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== activePage) {
      setCurrentPage(page)
      if (taskListRef.current) {
        taskListRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  // Generate pagination numbers array
  const getPaginationNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (activePage <= 3) {
      return [1, 2, 3, 4, '...', totalPages]
    }
    if (activePage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    return [1, '...', activePage - 1, activePage, activePage + 1, '...', totalPages]
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-7">

        {/* App Title with Reload Button */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">My Todo App</h1>
            <button
              onClick={handleLoadFromApi}
              disabled={loading}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Reload from API (200 tasks)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simple Task Manager ({todos.length} Tasks • {ITEMS_PER_PAGE} Per Page)
          </p>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Write a new task..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-slate-800"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
          >
            Add
          </button>
        </form>

        {/* Current Page Item Range Info */}
        {!loading && todos.length > 0 && (
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
            <span>
              Showing tasks <strong className="text-slate-700">{startIndex + 1}–{Math.min(endIndex, todos.length)}</strong> of <strong className="text-slate-700">{todos.length}</strong>
            </span>
            <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
              Page {activePage} of {totalPages}
            </span>
          </div>
        )}

        {/* Task List */}
        <div>
          {loading ? (
            <p className="text-center text-sm text-slate-400 py-6">Loading tasks...</p>
          ) : todos.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-400 mb-3">No tasks left!</p>
              <button
                onClick={handleLoadFromApi}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Reload from API
              </button>
            </div>
          ) : (
            <ul
              ref={taskListRef}
              className="space-y-2 max-h-[380px] overflow-y-auto pr-1"
            >
              {currentTodos.map((todo, idx) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1 mr-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                    />
                    <span className="text-xs font-mono font-medium text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded shrink-0">
                      #{startIndex + idx + 1}
                    </span>
                    <span
                      className={`text-sm break-words ${
                        todo.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-700 font-medium'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </label>

                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition shrink-0 cursor-pointer"
                    title="Delete task"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 1-2h6c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            {/* Prev Button */}
            <button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition flex items-center gap-1 cursor-pointer"
              aria-label="Previous page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>Prev</span>
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1">
              {getPaginationNumbers().map((num, i) =>
                num === '...' ? (
                  <span key={`dots-${i}`} className="w-7 text-center text-xs text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                      activePage === num
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition flex items-center gap-1 cursor-pointer"
              aria-label="Next page"
            >
              <span>Next</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        )}

        {/* Footer Summary */}
        {todos.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>
              Total: <strong className="text-slate-700">{todos.length}</strong> tasks
            </span>
            <span>
              Completed: <strong className="text-emerald-600">{todos.filter((t) => t.completed).length}</strong>
            </span>
          </div>
        )}

      </div>
    </div>
  )
}
