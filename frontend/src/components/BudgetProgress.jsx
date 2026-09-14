export default function BudgetProgress({ budget, monthlyExpenses }) {
  if (!budget) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Budget Progress</h2>
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No monthly budget set.</p>
          <p className="text-gray-400 text-xs mt-1">Set a budget to track your spending.</p>
        </div>
      </div>
    )
  }

  const budgetAmount = budget.amount
  const remaining = budgetAmount - monthlyExpenses
  const percentage = Math.round((monthlyExpenses / budgetAmount) * 100)
  const cappedPercentage = Math.min(percentage, 100)

  let statusColor = 'text-emerald-600'
  let statusBg = 'bg-emerald-50'
  let statusText = "You're within your budget."

  if (percentage >= 100) {
    statusColor = 'text-red-600'
    statusBg = 'bg-red-50'
    statusText = "You're over your budget."
  } else if (percentage >= 80) {
    statusColor = 'text-amber-600'
    statusBg = 'bg-amber-50'
    statusText = "You're close to your budget."
  }

  let barColor = 'bg-emerald-500'
  if (percentage >= 100) {
    barColor = 'bg-red-500'
  } else if (percentage >= 80) {
    barColor = 'bg-amber-500'
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Budget Progress</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Budget</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">₹{budgetAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Spent</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">₹{monthlyExpenses.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Remaining</span>
          <span className={`font-semibold text-sm sm:text-base ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ₹{Math.abs(remaining).toLocaleString()}{remaining < 0 ? ' over' : ''}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-700">{percentage}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${cappedPercentage}%` }}
          />
        </div>
      </div>

      <div className={`px-3 py-2 rounded-lg ${statusBg}`}>
        <p className={`text-xs sm:text-sm font-medium ${statusColor}`}>{statusText}</p>
      </div>
    </div>
  )
}
