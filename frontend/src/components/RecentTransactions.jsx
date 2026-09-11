const transactions = [
  {
    id: 1,
    category: 'Food',
    emoji: '🍔',
    amount: -30,
    date: 'Today',
    color: 'bg-red-100',
  },
  {
    id: 2,
    category: 'Transport',
    emoji: '🚌',
    amount: -50,
    date: 'Today',
    color: 'bg-blue-100',
  },
  {
    id: 3,
    category: 'Shopping',
    emoji: '🛒',
    amount: -500,
    date: 'Yesterday',
    color: 'bg-purple-100',
  },
  {
    id: 4,
    category: 'Salary',
    emoji: '💼',
    amount: 30000,
    date: 'Sep 1',
    color: 'bg-emerald-100',
  },
]

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-2 gap-2 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${tx.color}`}>
                <span className="text-base sm:text-lg">{tx.emoji}</span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{tx.category}</p>
                <p className="text-xs sm:text-sm text-gray-500">{tx.date}</p>
              </div>
            </div>
            <span
              className={`font-semibold shrink-0 text-sm sm:text-base ${
                tx.amount > 0 ? 'text-emerald-600' : 'text-gray-900'
              }`}
            >
              {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
