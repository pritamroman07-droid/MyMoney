import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="pt-16 lg:pl-64">
        <Dashboard />
      </div>
    </div>
  )
}

export default App
