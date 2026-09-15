import { useState, useEffect } from 'react'
import SummaryCard from '../components/SummaryCard'
import QuickExpense from '../components/QuickExpense'
import AddIncome from '../components/AddIncome'
import BudgetSetup from '../components/BudgetSetup'
import BudgetProgress from '../components/BudgetProgress'
import SpendingChart from '../components/SpendingChart'
import CategoryChart from '../components/CategoryChart'
import RecentTransactions from '../components/RecentTransactions'
import FallingMoney from '../components/FallingMoney'

const EXPENSE_API = '/api/transactions'
const INCOME_API = '/api/income'
const BUDGET_API = '/api/budget'

export default function Dashboard({ token }) {
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])
  const [budget, setBudget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      const [expenseRes, incomeRes, budgetRes] = await Promise.all([
        fetch(EXPENSE_API, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(INCOME_API, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(BUDGET_API, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      const expenseData = await expenseRes.json()
      const incomeData = await incomeRes.json()
      const budgetData = await budgetRes.json()
      setExpenses(expenseData)
      setIncome(incomeData)
      setBudget(budgetData)
    } catch {
      setError('Unable to load data')
    } finally {
      setLoading(false)
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
  const totalBalance = totalIncome - totalExpenses

  const today = new Date().toISOString().split('T')[0]
  const todayExpenses = expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyExpenses = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0)
  const monthlyIncome = income
    .filter((i) => i.date.startsWith(currentMonth))
    .reduce((sum, i) => sum + i.amount, 0)

  const hasIncome = income.length > 0
  const showAnimation = hasIncome && totalBalance >= 0

  return (
    <div className="relative p-3 sm:p-4 md:p-6 lg:p-8">
      <FallingMoney />

      {/* ROW 1 — Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Good Morning
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Here's your financial overview</p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading data...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ROW 2 — Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <SummaryCard
              title="Total Balance"
              amount={`₹${totalBalance.toLocaleString()}`}
              color="bg-emerald-100 dark:bg-emerald-900/30"
              icon={
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <SummaryCard
              title="Today's Expense"
              amount={`₹${todayExpenses.toLocaleString()}`}
              color="bg-red-100 dark:bg-red-900/30"
              icon={
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <SummaryCard
              title="Monthly Spending"
              amount={`₹${monthlyExpenses.toLocaleString()}`}
              color="bg-amber-100 dark:bg-amber-900/30"
              icon={
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
            />
            <SummaryCard
              title="Monthly Income"
              amount={`₹${monthlyIncome.toLocaleString()}`}
              color="bg-blue-100 dark:bg-blue-900/30"
              icon={
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
          </div>

          {/* ROW 3+4 — Two continuous columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4">
              <QuickExpense expenses={expenses} setExpenses={setExpenses} token={token} />
              <AddIncome income={income} setIncome={setIncome} token={token} />
              <SpendingChart expenses={expenses} />
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4">
              <BudgetSetup budget={budget} setBudget={setBudget} token={token} />
              <BudgetProgress budget={budget} monthlyExpenses={monthlyExpenses} />
              <CategoryChart expenses={expenses} />
              <RecentTransactions
                expenses={expenses}
                setExpenses={setExpenses}
                income={income}
                setIncome={setIncome}
                token={token}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
