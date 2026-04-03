import { LayoutDashboard, ReceiptText, PanelLeft, X } from 'lucide-react'
import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-gray-200 dark:border-slate-800"
      >
        {isOpen ? <X className="w-6 h-6" /> : <PanelLeft className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <span className="text-xl font-bold">Z</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Zorvyn</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'}
                `}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-500">
            © 2024 Zorvyn Finance
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
