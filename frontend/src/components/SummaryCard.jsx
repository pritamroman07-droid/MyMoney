export default function SummaryCard({ title, amount, icon, color }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow min-w-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm text-gray-500 truncate pr-2">{title}</span>
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{amount}</p>
    </div>
  )
}
