# Zorvyn Finance Dashboard

A clean, modern, and responsive personal finance tracking UI built with **React**, **Tailwind CSS**, and **Recharts**.

![Dashboard Preview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070)

## 🚀 Features

- **Dashboard Overview**: Summary cards for Balance, Income, and Expenses with trend indicators.
- **Data Visualization**: 
  - Interactive Area Chart for balance trends.
  - Pie Chart for spending distribution by category.
- **Transactions Management**:
  - Full CRUD operations (Add/Delete/View) for Admin role.
  - Advanced search, filtering (by type), and sorting (by date/amount).
- **Role-Based UI**: Toggle between **Viewer** and **Admin** roles to simulate access control.
- **Insights Section**: Automated insights for highest spending categories and savings rates.
- **Premium UX**:
  - **Dark Mode**: Seamless toggle between light and dark themes.
  - **Responsive Design**: Optimized for Mobile, Tablet, and Desktop.
  - **Animations**: Fluid transitions using Framer Motion.
  - **Persistence**: Data saved locally in `localStorage`.
  - **Export**: Export transactions table as CSV or JSON.

## 🛠️ Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State**: React Context API

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (or copy files):
   ```bash
   cd finance-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI components (Sidebar, Navbar, SummaryCard)
├── context/         # FinanceContext for global state
├── pages/           # Page views (Dashboard, Transactions)
├── utils/           # Helper functions and formatting utilities
├── App.jsx          # Root component and layout
└── main.jsx         # Entry point
```

---
Built with ❤️ by Antigravity (Google DeepMind)
