import React, { useEffect, useState } from 'react';
import { getTransactions, createTransaction, deleteTransaction, updateTransaction } from '../api';
import './Transactions.css';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Salary', 'Freelance', 'Investment', 'Other'];

const CATEGORY_COLORS = {
  Food: '#f97316', Transport: '#3b82f6', Shopping: '#ec4899',
  Bills: '#ef4444', Health: '#22c55e', Entertainment: '#a78bfa',
  Salary: '#10b981', Freelance: '#f59e0b', Investment: '#6366f1', Other: '#94a3b8'
};

const emptyForm = { title: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().split('T')[0], note: '' };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState({ type: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions(filter);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.amount) { setError('Title and amount are required.'); return; }
    try {
      if (editId) {
        await updateTransaction(editId, form);
        setEditId(null);
      } else {
        await createTransaction(form);
      }
      setForm(emptyForm);
      setShowForm(false);
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (tx) => {
    setForm({ title: tx.title, amount: tx.amount, type: tx.type, category: tx.category, date: tx.date.split('T')[0], note: tx.note || '' });
    setEditId(tx._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await deleteTransaction(id);
    fetchTransactions();
  };

  const handleCancel = () => { setForm(emptyForm); setEditId(null); setShowForm(false); setError(''); };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Manage your income and expenses</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}>
          + Add Transaction
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editId ? 'Edit Transaction' : 'New Transaction'}</h3>
          {error && <p className="form-error">{error}</p>}
          <form onSubmit={handleSubmit} className="tx-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="e.g. Monthly Rent" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" placeholder="0" min="0" value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Note (optional)</label>
              <input type="text" placeholder="Any additional info..." value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editId ? 'Update' : 'Save'}</button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="filters">
        <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(filter.type || filter.category) && (
          <button className="btn-ghost" onClick={() => setFilter({ type: '', category: '' })}>Clear Filters</button>
        )}
      </div>

      {loading ? (
        <p className="loading">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Add your first transaction</button>
        </div>
      ) : (
        <div className="tx-table-wrapper">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id}>
                  <td>
                    <div className="tx-title">{tx.title}</div>
                    {tx.note && <div className="tx-note">{tx.note}</div>}
                  </td>
                  <td>
                    <span className="category-badge" style={{ background: CATEGORY_COLORS[tx.category] + '22', color: CATEGORY_COLORS[tx.category] }}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="tx-date">{new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <span className={`type-badge ${tx.type}`}>{tx.type}</span>
                  </td>
                  <td className={`tx-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="tx-actions">
                    <button className="btn-edit" onClick={() => handleEdit(tx)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(tx._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
