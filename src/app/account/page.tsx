"use client";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

const GearIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">⚙️</span>;
const ChartIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📊</span>;
const SubIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">💳</span>;
const ClockIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">🕒</span>;
const SuggestionIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">💡</span>;

const platforms = ["eBay", "Facebook Marketplace", "Craigslist", "OfferUp", "Mercari", "Other"];
const conditions = ["New", "Like New", "Used", "For Parts", "Other"];

type MostProfitable = { item: string; total: number; sale: number; purchase: number } | null;

export default function AccountPage() {
  const { session, isLoading } = useProtectedRoute();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ totalSold: number; totalMade: number; mostProfitable: MostProfitable }>({ totalSold: 0, totalMade: 0, mostProfitable: null });
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState('');
  const [form, setForm] = useState({
    type: 'purchase',
    item: '',
    price: '',
    date: '',
    platform: '',
    condition: '',
    notes: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [editTx, setEditTx] = useState<any | null>(null);
  const [editForm, setEditForm] = useState(form);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Fetch transactions
  useEffect(() => {
    if (!session) return;
    setTxLoading(true);
    setTxError('');
    fetch(`/api/transactions?userId=${session.user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setTransactions(data.transactions || []);
      })
      .catch(err => setTxError(err.message || 'Failed to fetch transactions'))
      .finally(() => setTxLoading(false));
  }, [session]);

  // Calculate stats: Total Sold = sales count, Total Made = sales sum - purchase sum, Most Profitable Item = best (sale - purchase) pair
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setStats({ totalSold: 0, totalMade: 0, mostProfitable: null });
      return;
    }
    let totalSold = 0;
    let totalSales = 0;
    let totalPurchases = 0;
    let bestProfit = -Infinity;
    let bestItem: MostProfitable = null;
    // Group purchases and sales by item
    const purchasesByItem: Record<string, number[]> = {};
    const salesByItem: Record<string, number[]> = {};
    transactions.forEach((tx: any) => {
      if (tx.type === 'sale' && tx.price) {
        totalSold += 1;
        totalSales += Number(tx.price);
        salesByItem[tx.item] = salesByItem[tx.item] || [];
        salesByItem[tx.item].push(Number(tx.price));
      }
      if (tx.type === 'purchase' && tx.price) {
        totalPurchases += Number(tx.price);
        purchasesByItem[tx.item] = purchasesByItem[tx.item] || [];
        purchasesByItem[tx.item].push(Number(tx.price));
      }
    });
    // Find most profitable item (best single flip: max(sale - purchase) for any item)
    Object.keys(salesByItem).forEach(item => {
      const sales = salesByItem[item];
      const purchases = purchasesByItem[item] || [];
      // Try to match each sale to a purchase (greedy: lowest purchase to highest sale)
      const sortedSales = [...sales].sort((a, b) => b - a);
      const sortedPurchases = [...purchases].sort((a, b) => a - b);
      for (let i = 0; i < Math.min(sortedSales.length, sortedPurchases.length); i++) {
        const profit = sortedSales[i] - sortedPurchases[i];
        if (profit > bestProfit) {
          bestProfit = profit;
          bestItem = { item, total: profit, sale: sortedSales[i], purchase: sortedPurchases[i] };
        }
      }
    });
    setStats({
      totalSold,
      totalMade: totalSales - totalPurchases,
      mostProfitable: bestItem
    });
  }, [transactions]);

  // Add transaction handler
  const handleAddTransaction = async (e: any) => {
    e.preventDefault();
    if (!session) return;
    setFormLoading(true);
    setFormError('');
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          ...form,
          price: parseFloat(form.price),
          date: form.date || new Date().toISOString(),
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add transaction');
      setTransactions([data.transaction, ...transactions]);
      setShowModal(false);
      setForm({ type: 'sale', item: '', price: '', date: '', platform: '', condition: '', notes: '' });
    } catch (err: any) {
      setFormError(err.message || 'Failed to add transaction');
    } finally {
      setFormLoading(false);
    }
  };

  // Edit transaction handler
  const handleEditTransaction = async (e: any) => {
    e.preventDefault();
    if (!session) return;
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(`/api/transactions?id=${editTx.id}&userId=${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          price: parseFloat(editForm.price),
          date: editForm.date || new Date().toISOString(),
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update transaction');
      setTransactions(transactions.map(tx => tx.id === editTx.id ? data.transaction : tx));
      setEditTx(null);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update transaction');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete transaction handler
  const handleDeleteTransaction = async () => {
    if (!editTx || !session) return;
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(`/api/transactions?id=${editTx.id}&userId=${session.user.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      setTransactions(transactions.filter(tx => tx.id !== editTx.id));
      setEditTx(null);
    } catch (err: any) {
      setEditError(err.message || 'Failed to delete transaction');
    } finally {
      setEditLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // This will be handled by useProtectedRoute
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-md mt-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 mb-2 flex items-center justify-center text-3xl">
            {session.user.email?.[0]?.toUpperCase()}
          </div>
          <div className="font-bold text-lg text-gray-800 mb-1">{session.user.email}</div>
          <Link href="/account/profile" className="text-gray-400 text-sm hover:underline mb-2">Edit profile</Link>
        </div>
        {/* Account Options List */}
        <div className="bg-white rounded-2xl shadow divide-y divide-gray-100 mb-6">
          <Link href="/account/subscription" className="flex items-center px-6 py-4 hover:bg-gray-50 transition">
            <SubIcon />
            <span className="flex-1">Change Subscription</span>
            <span className="text-gray-400">›</span>
          </Link>
          <Link href="/account/settings" className="flex items-center px-6 py-4 hover:bg-gray-50 transition">
            <GearIcon />
            <span className="flex-1">Settings & Options</span>
            <span className="text-gray-400">›</span>
          </Link>
          <Link href="/suggestions" className="flex items-center px-6 py-4 hover:bg-gray-50 transition">
            <SuggestionIcon />
            <span className="flex-1">Suggestions & Feedback</span>
            <span className="text-gray-400">›</span>
          </Link>
        </div>
        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <ChartIcon />
            <span className="font-semibold text-gray-800 text-lg">Your Stats</span>
          </div>
          <div className="flex flex-col gap-2 text-gray-700">
            <div>Total Sold: <b>{stats.totalSold}</b></div>
            <div>Total Made: <b>${stats.totalMade.toLocaleString(undefined, { maximumFractionDigits: 2 })}</b></div>
            <div>Most Profitable Item: <b>{stats.mostProfitable ? `${stats.mostProfitable.item} (+$${stats.mostProfitable.total.toLocaleString(undefined, { maximumFractionDigits: 2 })} | Sold $${stats.mostProfitable.sale} - Bought $${stats.mostProfitable.purchase})` : 'N/A'}</b></div>
          </div>
        </div>
        
        {/* Transaction Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
              <form onSubmit={handleAddTransaction} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <select className="flex-1 rounded border p-2" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="sale">Sale</option>
                    <option value="purchase">Purchase</option>
                  </select>
                  <input className="flex-1 rounded border p-2" placeholder="Item" value={form.item} onChange={e => setForm(f => ({ ...f, item: e.target.value }))} required />
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 rounded border p-2" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                  <input className="flex-1 rounded border p-2" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div className="flex gap-2">
                  <select className="flex-1 rounded border p-2" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                    <option value="">Platform</option>
                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select className="flex-1 rounded border p-2" value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
                    <option value="">Condition</option>
                    {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <textarea className="rounded border p-2" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
                <button type="submit" className="btn-primary mt-2" disabled={formLoading}>{formLoading ? 'Saving...' : 'Add Transaction'}</button>
              </form>
            </div>
          </div>
        )}
        {/* Edit Transaction Modal */}
        {editTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setEditTx(null)}>&times;</button>
              <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
              <form onSubmit={handleEditTransaction} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <select className="flex-1 rounded border p-2" value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="purchase">Purchase</option>
                    <option value="sale">Sale</option>
                  </select>
                  <input className="flex-1 rounded border p-2" placeholder="Item" value={editForm.item} onChange={e => setEditForm(f => ({ ...f, item: e.target.value }))} required />
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 rounded border p-2" type="number" min="0" step="0.01" placeholder="Price" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} required />
                  <input className="flex-1 rounded border p-2" type="date" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div className="flex gap-2">
                  <select className="flex-1 rounded border p-2" value={editForm.platform} onChange={e => setEditForm(f => ({ ...f, platform: e.target.value }))}>
                    <option value="">Platform</option>
                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select className="flex-1 rounded border p-2" value={editForm.condition} onChange={e => setEditForm(f => ({ ...f, condition: e.target.value }))}>
                    <option value="">Condition</option>
                    {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <textarea className="rounded border p-2" placeholder="Notes (optional)" value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
                {editError && <div className="text-red-500 text-sm text-center">{editError}</div>}
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="btn-primary flex-1" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" className="text-red-500 btn-danger flex-1" disabled={editLoading} onClick={handleDeleteTransaction}>Delete</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Transaction List */}
        <div className="bg-white rounded-2xl shadow p-6 mb-2">
          <div className="flex items-center mb-4 justify-between">
            <span className="font-semibold text-gray-800 text-lg">Your Transactions</span>
            <Link href="/account/transactions" className="text-sm text-green-600 hover:text-green-700 font-medium border border-green-200 rounded-lg px-3 py-1 ml-2">View All</Link>
          </div>
          {txLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : txError ? (
            <div className="text-red-500">{txError}</div>
          ) : transactions.length === 0 ? (
            <div className="text-gray-500">No transactions yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {transactions.map(tx => (
                <li key={tx.id} className="py-3 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{tx.type.toUpperCase()}</span>
                    <span className="font-medium text-gray-800 flex-1">{tx.item}</span>
                    <span className="text-gray-500 text-sm">${parseFloat(tx.price).toFixed(2)}</span>
                    <button className="ml-2 text-xs text-blue-600 hover:underline" onClick={() => { setEditTx(tx); setEditForm({ ...tx, price: tx.price.toString(), date: tx.date ? tx.date.split('T')[0] : '' }); }}>Edit</button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>{tx.platform}</span>
                    <span>{tx.condition}</span>
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                    {tx.notes && <span className="italic">{tx.notes}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Add Transaction Button */}
        <button
          className="w-full mb-4 py-3 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
          onClick={() => setShowModal(true)}
        >
          + Add Transaction
        </button>
        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
} 