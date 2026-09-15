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

const categoryBarColors = {
  Food: 'bg-red-500',
  Transport: 'bg-blue-500',
  Shopping: 'bg-purple-500',
  Bills: 'bg-amber-500',
  Entertainment: 'bg-pink-500',
  Education: 'bg-indigo-500',
  Other: 'bg-gray-500',
}

export default function CategoryChart({ expenses }) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))

  const categoryData = categories.map((cat) => {
    const total = monthlyExpenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0)
    return { category: cat, amount: total }
  }).filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const maxAmount = categoryData.length > 0 ? Math.max(...categoryData.map((d) => d.amount)) : 1

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Category Spending</h2>

      {categoryData.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No spending data yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryData.map((data) => (
            <div key={data.category}>
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="text-gray-600">{categoryEmojis[data.category]} {data.category}</span>
                <span className="font-medium text-gray-900">₹{data.amount.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${categoryBarColors[data.category]}`}
                  style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
