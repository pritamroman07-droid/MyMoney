const weeklyData = [
  { week: 'Week 1', amount: 1200 },
  { week: 'Week 2', amount: 1800 },
  { week: 'Week 3', amount: 1400 },
  { week: 'Week 4', amount: 1000 },
]

const maxAmount = Math.max(...weeklyData.map((d) => d.amount))

export default function SpendingChart() {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h2>

      <div className="space-y-4">
        {weeklyData.map((data) => (
          <div key={data.week}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{data.week}</span>
              <span className="font-medium text-gray-900">₹{data.amount}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(data.amount / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Total This Month</span>
          <span className="font-semibold text-gray-900">
            ₹{weeklyData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
