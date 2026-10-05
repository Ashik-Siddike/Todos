import { useState, useEffect } from 'react'

// LocalStorage key name
const STORAGE_KEY = 'todo_app_tasks'

// Initial data fetch URL
const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=50'

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
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-6">
        
        {/* App Title with Reload Button */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">My Todo App</h1>
            <button
              onClick={handleLoadFromApi}
              disabled={loading}
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Reload from API"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Simple Task Manager (API & LocalStorage)</p>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
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
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition"
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1 mr-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span
                      className={`text-sm break-all ${
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

        {/* Footer Summary */}
        {todos.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Total: {todos.length}</span>
            <span>Completed: {todos.filter((t) => t.completed).length}</span>
          </div>
        )}

      </div>
    </div>
  )
}
