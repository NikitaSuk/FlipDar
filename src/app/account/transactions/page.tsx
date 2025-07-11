"use client";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProtectedRoute } from '../../../hooks/useProtectedRoute';

const TransactionIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📝</span>;

export default function TransactionsPage() {
  const { session, isLoading } = useProtectedRoute();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    setLoading(true);
    fetch(`/api/transactions?userId=${session.user.id}`)
      .then(res => res.json())
      .then(data => setTransactions(data.transactions || []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // This will be handled by useProtectedRoute
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/account" className="text-gray-600 hover:text-gray-800 mr-4">← Back to Account</Link>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center"><TransactionIcon />All Transactions</h1>
          </div>
        </div>

        {/* Table or Cards */}
        <div className="bg-white rounded-2xl shadow p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">🗂️</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Transactions Found</h2>
              <p className="text-gray-600 mb-4">Start adding your purchases and sales to track your flipping journey.</p>
              <Link href="/account" className="btn-primary">Add Your First Transaction</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{tx.item}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{tx.type.toUpperCase()}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">${parseFloat(tx.price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${tx.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{tx.status || 'pending'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 