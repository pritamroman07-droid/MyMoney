import { useState } from 'react'

const API_URL = '/api/income'

export default function AddIncome({ income, setIncome, token }) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAddIncome = async () => {
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

    if (!date) {
      setError('Please select a date')
      return
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parsed, date }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Unable to add income')
        return
      }

      setIncome([data.income, ...income])
      setAmount('')
      setDate(new Date().toISOString().split('T')[0])
      setSuccess('Income added successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Unable to add income')
    }
  }

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Add Income</h2>

      <div className="space-y-3">
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
              className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm text-gray-500 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              setError('')
            }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          onClick={handleAddIncome}
          className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          + Add Income
        </button>

        {success && (
          <p className="text-blue-600 text-xs text-center">{success}</p>
        )}
      </div>
    </div>
  )
}
