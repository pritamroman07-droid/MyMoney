import { useState } from 'react'

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Other']

const categoryEmojis = {
  Food: '🍔',
  Transport: '🚌',
  Shopping: '🛒',
  Bills: '💼',
  Entertainment: '🎬',
  Education: '📚',
  Other: '📦',
}

const categoryColors = {
  Food: 'bg-red-100',
  Transport: 'bg-blue-100',
  Shopping: 'bg-purple-100',
  Bills: 'bg-amber-100',
  Entertainment: 'bg-pink-100',
  Education: 'bg-indigo-100',
  Other: 'bg-gray-100',
}

const formatDate = (dateStr) => {
  const today = new Date().toISOString().split('T')[0]
  if (dateStr === today) return 'Today'

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday'

  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

export default function RecentTransactions({ expenses, setExpenses }) {
  const [editingId, setEditingId] = useState(null)
  const [editAmount, setEditAmount] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editError, setEditError] = useState('')

  const sorted = [...expenses].sort((a, b) => b.id - a.id)

  const handleEdit = (tx) => {
    setEditingId(tx.id)
    setEditAmount(tx.amount.toString())
    setEditCategory(tx.category)
    setEditError('')
  }

  const handleSaveEdit = (id) => {
    setEditError('')
    const parsed = parseFloat(editAmount)

    if (!editAmount || isNaN(parsed)) {
      setEditError('Please enter a valid amount')
      return
    }

    if (parsed <= 0) {
      setEditError('Amount must be greater than zero')
      return
    }

    setExpenses(expenses.map((e) =>
      e.id === id ? { ...e, amount: parsed, category: editCategory } : e
    ))
    setEditingId(null)
  }

  const handleDelete = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>

      <div className="space-y-3">
        {sorted.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-2 gap-2 min-w-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${categoryColors[tx.category] || 'bg-gray-100'}`}>
                <span className="text-base sm:text-lg">{categoryEmojis[tx.category] || '📦'}</span>
              </div>
              <div className="min-w-0 flex-1">
                {editingId === tx.id ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => {
                          setEditAmount(e.target.value)
                          setEditError('')
                        }}
                        className="w-24 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    {editError && <p className="text-red-500 text-xs">{editError}</p>}
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{tx.category}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{formatDate(tx.date)}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {editingId === tx.id ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(tx.id)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="font-semibold text-sm sm:text-base text-gray-900">
                    -₹{tx.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleEdit(tx)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
