import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [page, setPage] = useState('login')

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setPage('dashboard')
    }
    setAuthLoading(false)
  }, [])

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    setPage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setPage('login')
    setSidebarOpen(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (page === 'register') {
    return <Register onRegister={handleLogin} onSwitchToLogin={() => setPage('login')} />
  }

  if (page === 'login' || !token) {
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setPage('register')} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={user} onLogout={handleLogout} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      <div className="pt-14 sm:pt-16 lg:pl-64">
        <Dashboard token={token} user={user} />
      </div>
    </div>
  )
}

export default App
