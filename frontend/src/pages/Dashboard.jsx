import { useState, useEffect } from 'react'
import SummaryCard from '../components/SummaryCard'
import QuickExpense from '../components/QuickExpense'
import SpendingChart from '../components/SpendingChart'
import RecentTransactions from '../components/RecentTransactions'

const INCOME = 30000

export default function Dashboard() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('mymoney-expenses')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('mymoney-expenses', JSON.stringify(expenses))
  }, [expenses])

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBalance = INCOME - totalExpenses

  const today = new Date().toISOString().split('T')[0]
  const todayExpenses = expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyExpenses = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Good Morning 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Here's your financial overview</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <SummaryCard
          title="Total Balance"
          amount={`₹${totalBalance.toLocaleString()}`}
          color="bg-emerald-100"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <SummaryCard
          title="Today's Expense"
          amount={`₹${todayExpenses.toLocaleString()}`}
          color="bg-red-100"
          icon={
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <SummaryCard
          title="Monthly Spending"
          amount={`₹${monthlyExpenses.toLocaleString()}`}
          color="bg-amber-100"
          icon={
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
        <SummaryCard
          title="Monthly Income"
          amount={`₹${INCOME.toLocaleString()}`}
          color="bg-blue-100"
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="lg:col-span-1">
          <QuickExpense expenses={expenses} setExpenses={setExpenses} />
        </div>
        <div className="lg:col-span-2">
          <SpendingChart expenses={expenses} />
        </div>
      </div>

      <RecentTransactions expenses={expenses} setExpenses={setExpenses} />
    </div>
  )
}
