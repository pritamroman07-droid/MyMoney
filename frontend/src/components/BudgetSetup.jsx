import { useState, useEffect } from 'react'

const API_URL = '/api/budget'

export default function BudgetSetup({ budget, setBudget, token }) {
  const [amount, setAmount] = useState(budget ? budget.amount.toString() : '')
  const [editing, setEditing] = useState(!budget)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const handleEditBudget = () => {
      setEditing(true)
      if (budget) {
        setAmount(budget.amount.toString())
      }
    }

    window.addEventListener('edit-budget', handleEditBudget)
    return () => window.removeEventListener('edit-budget', handleEditBudget)
  }, [budget])

  const handleSave = async () => {
    setError('')
    setSuccess('')

    const parsed = parseFloat(amount)

    if (!amount || isNaN(parsed)) {
      setError('Please enter a valid amount')
      return
    }

    if (parsed <= 0) {
      setError('Amount must be greater than zero')
      return
    }

    try {
      const url = budget ? `${API_URL}/${budget._id}` : API_URL
      const method = budget ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parsed }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Unable to save budget')
        return
      }

      setBudget(data.budget)
      setEditing(false)
      setSuccess('Budget saved')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Unable to save budget')
    }
  }

  const handleDelete = async () => {
    if (!budget) return

    try {
      const res = await fetch(`${API_URL}/${budget._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) return

      setBudget(null)
      setAmount('')
      setEditing(true)
    } catch {
      // silently fail
    }
  }

  if (!editing && budget) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Monthly Budget</h2>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          ₹{budget.amount.toLocaleString()}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 sm:py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            Edit Budget
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-2 sm:py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Monthly Budget</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs sm:text-sm text-gray-500 mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError('')
              }}
              placeholder="0"
              className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-violet-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors text-sm sm:text-base"
          >
            {budget ? 'Update Budget' : 'Set Budget'}
          </button>
          {budget && (
            <button
              onClick={() => {
                setEditing(false)
                setAmount(budget.amount.toString())
                setError('')
              }}
              className="px-4 py-2.5 sm:py-3 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
          )}
        </div>

        {success && (
          <p className="text-violet-600 text-xs text-center">{success}</p>
        )}
      </div>
    </div>
  )
}
