import { useFinance } from '../context/FinanceContext'
import SummaryCard from '../components/SummaryCard'
import { motion } from 'framer-motion'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, Package, ShoppingCart, Coffee, Car, Home, Tv } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const Dashboard = () => {
  const { transactions, totals, balance } = useFinance()

  // Logic for trend data and categories
  const trendData = [
    { name: 'Jan', income: 4200, expense: 3100 },
    { name: 'Feb', income: 3800, expense: 3500 },
    { name: 'Mar', income: totals.income, expense: totals.expense },
  ]

  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b']

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'food': return Coffee
      case 'travel': return Car
      case 'bills': return Home
      case 'entertainment': return Tv
      case 'shopping': return ShoppingCart
      default: return Package
    }
  }

  const topSpending = [...pieData].sort((a, b) => b.value - a.value).slice(0, 3)

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back, Anil!</h1>
        <p className="text-gray-500 dark:text-slate-400">Here's a breakdown of your finances this month.</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Balance" amount={balance} type="balance" index={0} />
        <SummaryCard title="Total Income" amount={totals.income} type="income" trend="+12.5%" index={1} />
        <SummaryCard title="Total Expenses" amount={totals.expense} type="expense" trend="-2.4%" index={2} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Trend */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Balance Trends</h3>
            <select className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer dark:text-slate-300">
              <option className="dark:bg-slate-900 text-gray-900 dark:text-white">Last 6 Months</option>
              <option className="dark:bg-slate-900 text-gray-900 dark:text-white">Last 3 Months</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--tw-card-bg, #fff)', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: 'var(--tw-card-text, #000)'
                  }} 
                  itemStyle={{ color: 'inherit' }}
                />
                <Area type="monotone" dataKey="income" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="transparent" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Spending Distribution */}
        <motion.div variants={itemVariants} className="card">
          <h3 className="text-lg font-bold mb-8">Spending Distribution</h3>
          <div className="flex flex-col md:flex-row items-center gap-8 h-full min-h-[300px]">
            <div className="h-[250px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--tw-card-bg, #fff)', 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: 'var(--tw-card-text, #000)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4 overflow-y-auto max-h-[250px] pr-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-medium text-gray-600 dark:text-slate-300">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold">${entry.value}</span>
                </div>
              ))}
              {pieData.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">No expense data available</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topSpending.map((item, idx) => {
          const CategoryIcon = getCategoryIcon(item.name)
          return (
            <motion.div variants={itemVariants} key={item.name} className="card p-4 flex items-center gap-4 border-l-4" style={{ borderColor: COLORS[idx % COLORS.length] }}>
              <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800">
                <CategoryIcon className="w-5 h-5 text-gray-600 dark:text-slate-300" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Highest {item.name}</p>
                <p className="text-lg font-bold">${item.value}</p>
              </div>
            </motion.div>
          )
        })}
        <motion.div variants={itemVariants} className="card p-4 flex items-center gap-4 bg-primary-600 text-white border-none">
          <div className="p-2 rounded-xl bg-white/20">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-white/70 font-medium">Savings Rate</p>
            <p className="text-lg font-bold">{Math.round((balance / (totals.income || 1)) * 100)}%</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard
