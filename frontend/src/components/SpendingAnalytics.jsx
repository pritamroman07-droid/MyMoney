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
  Food: 'bg-red-500',
  Transport: 'bg-blue-500',
  Shopping: 'bg-purple-500',
  Bills: 'bg-amber-500',
  Entertainment: 'bg-pink-500',
  Education: 'bg-indigo-500',
  Other: 'bg-gray-500',
}

export default function SpendingAnalytics({ expenses }) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))
  const totalSpending = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryTotals = categories.map((cat) => {
    const total = monthlyExpenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0)
    return { category: cat, total }
  }).filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)

  const highestCategory = categoryTotals.length > 0 ? categoryTotals[0] : null

  const avgPerDay = monthlyExpenses.length > 0
    ? Math.round(totalSpending / new Date().getDate())
    : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending Analytics</h2>

      {monthlyExpenses.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No spending data yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Add expenses to see analytics.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Spent</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">₹{totalSpending.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg/Day</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">₹{avgPerDay.toLocaleString()}</p>
            </div>
          </div>

          {highestCategory && (
            <div className="bg-violet-50 dark:bg-violet-900/30 rounded-lg p-3">
              <p className="text-xs text-violet-600 dark:text-violet-400 mb-1">Highest Spending</p>
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                {categoryEmojis[highestCategory.category]} {highestCategory.category} — ₹{highestCategory.total.toLocaleString()}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Category Breakdown</p>
            <div className="space-y-2">
              {categoryTotals.map((cat) => {
                const pct = Math.round((cat.total / totalSpending) * 100)
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {categoryEmojis[cat.category]} {cat.category}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        ₹{cat.total.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${categoryColors[cat.category]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
