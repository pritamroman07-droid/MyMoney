export default function SpendingChart({ expenses }) {
  const now = new Date()
  const currentMonth = now.toISOString().slice(0, 7)

  const getWeekNumber = (dateStr) => {
    const day = new Date(dateStr).getDate()
    if (day <= 7) return 'Week 1'
    if (day <= 14) return 'Week 2'
    if (day <= 21) return 'Week 3'
    return 'Week 4'
  }

  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  const weeklyData = weeks.map((week) => {
    const total = expenses
      .filter((e) => e.date.startsWith(currentMonth) && getWeekNumber(e.date) === week)
      .reduce((sum, e) => sum + e.amount, 0)
    return { week, amount: total }
  })

  const maxAmount = Math.max(...weeklyData.map((d) => d.amount), 1)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">Monthly Spending</h2>

      <div className="space-y-3">
        {weeklyData.map((data) => (
          <div key={data.week}>
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">{data.week}</span>
              <span className="font-medium text-gray-900 dark:text-white">₹{data.amount.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(data.amount / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total This Month</span>
          <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
            ₹{weeklyData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
