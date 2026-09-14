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

export default function RecentTransactions({ expenses }) {
  const sorted = [...expenses].sort((a, b) => b.id - a.id)

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>

      <div className="space-y-3">
        {sorted.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-2 gap-2 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${categoryColors[tx.category] || 'bg-gray-100'}`}>
                <span className="text-base sm:text-lg">{categoryEmojis[tx.category] || '📦'}</span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{tx.category}</p>
                <p className="text-xs sm:text-sm text-gray-500">{formatDate(tx.date)}</p>
              </div>
            </div>
            <span className="font-semibold shrink-0 text-sm sm:text-base text-gray-900">
              -₹{tx.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
