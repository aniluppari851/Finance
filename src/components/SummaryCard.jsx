import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '../utils/utils'
import { motion } from 'framer-motion'

const SummaryCard = ({ title, amount, type, trend, index }) => {
  const isIncome = type === 'income'
  const isExpense = type === 'expense'
  const isBalance = type === 'balance'

  const Icon = isIncome ? TrendingUp : isExpense ? TrendingDown : Wallet
  const colorClass = isIncome 
    ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20' 
    : isExpense 
      ? 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20'
      : 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card group hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {formatCurrency(amount)}
          </h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isIncome ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40'}`}>
                {trend}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Decorative Gradient Background */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-xl group-hover:from-primary-500/20 transition-colors" />
    </motion.div>
  )
}

export default SummaryCard
