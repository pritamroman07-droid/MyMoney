import { useState } from 'react'

const EXPENSE_API = '/api/transactions'
const INCOME_API = '/api/income'

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

export default function RecentTransactions({ expenses, setExpenses, income, setIncome, token }) {
  const [editingId, setEditingId] = useState(null)
  const [editingType, setEditingType] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editError, setEditError] = useState('')

  const expenseList = expenses.map((e) => ({ ...e, type: 'expense' }))
  const incomeList = income.map((i) => ({ ...i, type: 'income' }))
  const allTransactions = [...expenseList, ...incomeList].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const handleEdit = (tx) => {
    setEditingId(tx._id)
    setEditingType(tx.type)
    setEditAmount(tx.amount.toString())
    setEditCategory(tx.category || '')
    setEditDate(tx.date)
    setEditError('')
  }

  const handleSaveEdit = async (id, type) => {
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

    if (!editDate) {
      setEditError('Please select a date')
      return
    }

    try {
      if (type === 'expense') {
        if (!editCategory) {
          setEditError('Please select a category')
          return
        }

        const res = await fetch(`${EXPENSE_API}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parsed,
            category: editCategory,
            date: editDate,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setEditError(data.message || 'Unable to update expense')
          return
        }

        setExpenses(expenses.map((e) =>
          e._id === id ? data.transaction : e
        ))
      } else {
        const res = await fetch(`${INCOME_API}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parsed,
            date: editDate,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setEditError(data.message || 'Unable to update income')
          return
        }

        setIncome(income.map((i) =>
          i._id === id ? data.income : i
        ))
      }

      setEditingId(null)
    } catch {
      setEditError('Unable to update')
    }
  }

  const handleDelete = async (id, type) => {
    try {
      const api = type === 'expense' ? EXPENSE_API : INCOME_API
      const res = await fetch(`${api}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        return
      }

      if (type === 'expense') {
        setExpenses(expenses.filter((e) => e._id !== id))
      } else {
        setIncome(income.filter((i) => i._id !== id))
      }
    } catch {
      // silently fail
    }
  }

  const isEmpty = allTransactions.length === 0

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>

      {isEmpty ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No transactions yet</p>
          <p className="text-gray-400 text-xs mt-1">Add your first income or expense to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allTransactions.map((tx) => (
            <div key={tx._id} className="flex items-center justify-between py-2 gap-2 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  tx.type === 'income' ? 'bg-blue-100' : (categoryColors[tx.category] || 'bg-gray-100')
                }`}>
                  <span className="text-base sm:text-lg">
                    {tx.type === 'income' ? '💰' : (categoryEmojis[tx.category] || '📦')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  {editingId === tx._id ? (
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => {
                            setEditAmount(e.target.value)
                            setEditError('')
                          }}
                          className="w-24 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {editingType === 'expense' && (
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        )}
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => {
                            setEditDate(e.target.value)
                            setEditError('')
                          }}
                          className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      {editError && <p className="text-red-500 text-xs">{editError}</p>}
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                        {tx.type === 'income' ? 'Income' : tx.category}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">{formatDate(tx.date)}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {editingId === tx._id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(tx._id, tx.type)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
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
                    <span className={`font-semibold text-sm sm:text-base ${
                      tx.type === 'income' ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleEdit(tx)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tx._id, tx.type)}
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
      )}
    </div>
  )
}
