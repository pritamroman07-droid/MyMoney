import { useState } from 'react'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="pt-16">
        <h1 className="text-3xl font-bold text-gray-900 p-8">MyMoney Dashboard</h1>
      </div>
    </div>
  )
}

export default App
