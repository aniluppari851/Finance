import { Sun, Moon, UserCircle, ChevronDown } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'

const Navbar = () => {
  const { darkMode, setDarkMode, role, setRole } = useFinance()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex-1 lg:pl-0 pl-12">
        <h2 className="text-lg font-semibold md:text-xl text-gray-800 dark:text-white">Dashboard</h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Role Switcher */}
        <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full p-1 border border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setRole('viewer')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              role === 'viewer' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' 
                : 'text-gray-500 dark:text-slate-400'
            }`}
          >
            Viewer
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              role === 'admin' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' 
                : 'text-gray-500 dark:text-slate-400'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Profile Mock */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-slate-800">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">Anil Uppari</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 capitalize">{role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <UserCircle className="w-7 h-7" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
