import { useState } from 'react'

const API_URL = '/api/transactions'

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

export default function QuickExpense({ expenses, setExpenses, token }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAddExpense = async () => {
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
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parsed,
          category,
          date: new Date().toISOString().split('T')[0],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Unable to add expense')
        return
      }

      setExpenses([data.transaction, ...expenses])
      setAmount('')
      setSuccess('Expense added successfully ✓')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Unable to add expense')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Expense</h2>

      <div className="space-y-3">
        <div>
          <label className="block text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm sm:text-base">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError('')
              }}
              placeholder="0"
              className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-base sm:text-lg font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Category</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base sm:text-lg">
              {categoryEmojis[category]}
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button
          onClick={handleAddExpense}
          className="w-full bg-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm sm:text-base"
        >
          + Add Expense
        </button>

        {success && (
          <p className="text-emerald-600 dark:text-emerald-400 text-xs text-center">{success}</p>
        )}
      </div>
    </div>
  )
}
