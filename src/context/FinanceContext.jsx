import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

const MOCK_TRANSACTIONS = [
  { id: 1, date: '2024-03-01', description: 'Monthly Rent', amount: 1500, category: 'Bills', type: 'expense' },
  { id: 2, date: '2024-03-02', description: 'Grocery Store', amount: 120, category: 'Food', type: 'expense' },
  { id: 3, date: '2024-03-05', description: 'Salary Deposit', amount: 5000, category: 'Income', type: 'income' },
  { id: 4, date: '2024-03-07', description: 'Amazon Purchase', amount: 65, category: 'Shopping', type: 'expense' },
  { id: 5, date: '2024-03-10', description: 'Internet Bill', amount: 80, category: 'Bills', type: 'expense' },
  { id: 6, date: '2024-03-12', description: 'Freelance Project', amount: 800, category: 'Income', type: 'income' },
  { id: 7, date: '2024-03-15', description: 'Dining Out', amount: 45, category: 'Food', type: 'expense' },
  { id: 8, date: '2024-03-18', description: 'Gas Station', amount: 50, category: 'Travel', type: 'expense' },
  { id: 9, date: '2024-03-20', description: 'Netflix Subscription', amount: 15, category: 'Entertainment', type: 'expense' },
  { id: 10, date: '2024-03-22', description: 'Coffee Shop', amount: 12, category: 'Food', type: 'expense' },
];

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_transactions');
      return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
    } catch (e) {
      console.error("Failed to parse transactions:", e);
      return MOCK_TRANSACTIONS;
    }
  });
  
  const [role, setRole] = useState('admin'); // 'viewer' or 'admin'
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('finance_dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_dark_mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: Date.now() }, ...prev]);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...updatedTransaction, id } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'income') acc.income += t.amount;
    else acc.expense += t.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const balance = totals.income - totals.expense;

  return (
    <FinanceContext.Provider value={{
      transactions,
      role,
      setRole,
      darkMode,
      setDarkMode,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      totals,
      balance
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export default FinanceProvider;
