import React, { useEffect, useState } from 'react';
import { getSummary, getTransactions } from '../api';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const CATEGORY_COLORS = {
  Food: '#f97316', Transport: '#3b82f6', Shopping: '#ec4899',
  Bills: '#ef4444', Health: '#22c55e', Entertainment: '#a78bfa',
  Salary: '#10b981', Freelance: '#f59e0b', Investment: '#6366f1', Other: '#94a3b8'
};

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, categoryBreakdown: {} });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, txRes] = await Promise.all([getSummary(), getTransactions()]);
        setSummary(summaryRes.data);
        setRecent(txRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = Object.keys(summary.categoryBreakdown);
  const doughnutData = {
    labels: categories,
    datasets: [{
      data: categories.map(c => summary.categoryBreakdown[c]),
      backgroundColor: categories.map(c => CATEGORY_COLORS[c] || '#94a3b8'),
      borderWidth: 0, hoverOffset: 6
    }]
  };

  const barData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [summary.income, summary.expense],
      backgroundColor: ['#10b981', '#ef4444'],
      borderRadius: 8, borderSkipped: false
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#8888aa', font: { family: 'Plus Jakarta Sans', size: 12 } } } }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: { ticks: { color: '#8888aa' }, grid: { color: '#1e1e2e' } },
      y: { ticks: { color: '#8888aa', callback: v => `₹${v}` }, grid: { color: '#1e1e2e' } }
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your financial overview</p>
      </div>

      <div className="stat-cards">
        <div className="stat-card balance">
          <span className="stat-label">Total Balance</span>
          <span className="stat-value">₹{summary.balance.toLocaleString()}</span>
        </div>
        <div className="stat-card income">
          <span className="stat-label">Total Income</span>
          <span className="stat-value">+₹{summary.income.toLocaleString()}</span>
        </div>
        <div className="stat-card expense">
          <span className="stat-label">Total Expenses</span>
          <span className="stat-value">-₹{summary.expense.toLocaleString()}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Income vs Expenses</h3>
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="chart-card">
          <h3>Spending by Category</h3>
          {categories.length > 0
            ? <Doughnut data={doughnutData} options={chartOptions} />
            : <p className="empty-chart">No expense data yet</p>}
        </div>
      </div>

      <div className="recent-card">
        <h3>Recent Transactions</h3>
        {recent.length === 0 ? (
          <p className="empty-state">No transactions yet. Add one!</p>
        ) : (
          <div className="recent-list">
            {recent.map(tx => (
              <div key={tx._id} className="recent-item">
                <div className="recent-left">
                  <span className="category-dot" style={{ background: CATEGORY_COLORS[tx.category] || '#94a3b8' }} />
                  <div>
                    <p className="recent-title">{tx.title}</p>
                    <p className="recent-meta">{tx.category} · {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`recent-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
