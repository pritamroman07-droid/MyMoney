export default function SummaryCard({ title, amount, icon, color }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{title}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{amount}</p>
    </div>
  )
}
