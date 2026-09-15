export default function SummaryCard({ title, amount, icon, color }) {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow min-w-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm text-gray-500 truncate pr-2">{title}</span>
        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">{amount}</p>
    </div>
  )
}
