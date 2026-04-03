import { useState, useEffect } from 'react'
import FinanceProvider from './context/FinanceContext'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <FinanceProvider>
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {activeTab === 'dashboard' ? <Dashboard /> : <Transactions />}
            </div>
          </main>
        </div>
      </div>
    </FinanceProvider>
  )
}

export default App
