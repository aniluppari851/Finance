import { useState, useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency, formatDate } from '../utils/utils'
import { Search, Filter, Download, Plus, Trash2, Edit2, ChevronUp, ChevronDown, MoreVertical, ReceiptText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

const Transactions = () => {
  const { transactions, role, addTransaction, deleteTransaction, updateTransaction } = useFinance()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({ 
    description: '', 
    amount: 0, 
    category: 'Food', 
    type: 'expense', 
    date: new Date().toISOString().split('T')[0] 
  })

  // Filtering and Sorting logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             t.category.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === 'all' || t.type === typeFilter
        return matchesSearch && matchesType
      })
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
  }, [transactions, searchTerm, typeFilter, sortConfig])

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    addTransaction({ ...newTransaction, amount: parseFloat(newTransaction.amount) })
    setIsAddModalOpen(false)
    setNewTransaction({ 
      description: '', 
      amount: 0, 
      category: 'Food', 
      type: 'expense', 
      date: new Date().toISOString().split('T')[0] 
    })
  }

  const exportData = (format) => {
    const data = JSON.stringify(transactions, null, 2)
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <div className="w-4 h-4" />
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage and track all your financial activities.</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="relative inline-block text-left">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="btn-secondary gap-2 px-3 md:px-4"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden text-xs">Ex</span>
            </button>
            <AnimatePresence>
              {isExportOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsExportOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-48 origin-top-left rounded-xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-20 border border-gray-100 dark:border-slate-800"
                  >
                    <div className="p-1">
                      <button 
                        onClick={() => { exportData('csv'); setIsExportOpen(false); }} 
                        className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Export as CSV
                      </button>
                      <button 
                        onClick={() => { exportData('json'); setIsExportOpen(false); }} 
                        className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Export as JSON
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          {role === 'admin' && (
            <button onClick={() => setIsAddModalOpen(true)} className="btn-primary gap-2 px-3 md:px-4">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden text-xs">Add</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={itemVariants} className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                <th onClick={() => requestSort('date')} className="px-4 py-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-2">Date <SortIcon column="date" /></div>
                </th>
                <th onClick={() => requestSort('description')} className="px-4 py-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-2">Description <SortIcon column="description" /></div>
                </th>
                <th onClick={() => requestSort('category')} className="px-4 py-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-2">Category <SortIcon column="category" /></div>
                </th>
                <th onClick={() => requestSort('amount')} className="px-4 py-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-right">
                  <div className="flex items-center justify-end gap-2">Amount <SortIcon column="amount" /></div>
                </th>
                <th className="px-4 py-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300">Type</th>
                {role === 'admin' && <th className="px-4 py-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-600 dark:text-slate-400">{formatDate(t.date)}</td>
                    <td className="px-4 py-4">
                      <div className="text-xs md:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-none">{t.description}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-300">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className={`text-xs md:text-sm font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type}
                      </span>
                    </td>
                    {role === 'admin' && (
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                            <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                          <button onClick={() => deleteTransaction(t.id)} className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className="px-4 py-12 text-center text-gray-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <ReceiptText className="w-10 h-10 text-gray-200 dark:text-slate-800" />
                      <p>No transactions found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold">New Transaction</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">&times;</button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Description</label>
                  <input
                    required
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                    placeholder="e.g. Weekly Groceries"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Amount</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Category</label>
                    <select
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer dark:text-white"
                    >
                      <option>Food</option>
                      <option>Bills</option>
                      <option>Travel</option>
                      <option>Entertainment</option>
                      <option>Shopping</option>
                      <option>Income</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Type</label>
                    <select
                      value={newTransaction.type}
                      onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer dark:text-white"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Date</label>
                    <input
                      required
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary">Add Transaction</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Transactions
