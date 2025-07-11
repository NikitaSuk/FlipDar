"use client";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProtectedRoute } from '../../../hooks/useProtectedRoute';

const TransactionIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📝</span>;
const FilterIcon = () => <span className="inline-block w-4 h-4 mr-2">🔍</span>;
const SortIcon = () => <span className="inline-block w-4 h-4 mr-2">↕️</span>;

type SortField = 'date' | 'price' | 'item' | 'type' | 'platform';
type SortDirection = 'asc' | 'desc';

export default function TransactionsPage() {
  const { session, isLoading } = useProtectedRoute();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'purchase'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    if (!session?.user?.id) return;
    setLoading(true);
    fetch(`/api/transactions?userId=${session.user.id}`)
      .then(res => res.json())
      .then(data => setTransactions(data.transactions || []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [session]);

  // Get unique platforms for filter dropdown
  const platforms = ['all', ...Array.from(new Set(transactions.map(tx => tx.platform).filter(Boolean)))];

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter(tx => {
    const typeMatch = typeFilter === 'all' || tx.type === typeFilter;
    const platformMatch = platformFilter === 'all' || tx.platform === platformFilter;
    return typeMatch && platformMatch;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortField) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'price':
        aValue = parseFloat(a.price);
        bValue = parseFloat(b.price);
        break;
      case 'item':
        aValue = a.item.toLowerCase();
        bValue = b.item.toLowerCase();
        break;
      case 'type':
        aValue = a.type.toLowerCase();
        bValue = b.type.toLowerCase();
        break;
      case 'platform':
        aValue = (a.platform || '').toLowerCase();
        bValue = (b.platform || '').toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setPlatformFilter('all');
  };

  const hasActiveFilters = typeFilter !== 'all' || platformFilter !== 'all';

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
      <div className="w-full max-w-7xl mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/account" className="text-gray-600 hover:text-gray-800 mr-4">← Back to Account</Link>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center"><TransactionIcon />All Transactions</h1>
          </div>
          <div className="text-sm text-gray-500">
            {sortedTransactions.length} of {transactions.length} transactions
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <FilterIcon />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Transaction Type</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Types', count: transactions.length },
                    { value: 'sale', label: 'Sales', count: transactions.filter(tx => tx.type === 'sale').length },
                    { value: 'purchase', label: 'Purchases', count: transactions.filter(tx => tx.type === 'purchase').length }
                  ].map(option => (
                    <label key={option.value} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="typeFilter"
                          value={option.value}
                          checked={typeFilter === option.value}
                          onChange={(e) => setTypeFilter(e.target.value as 'all' | 'sale' | 'purchase')}
                          className="mr-3 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {option.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Platform Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Platform</label>
                <div className="space-y-2">
                  {platforms.map(platform => {
                    const count = transactions.filter(tx => 
                      platform === 'all' ? true : tx.platform === platform
                    ).length;
                    return (
                      <label key={platform} className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="platformFilter"
                            value={platform}
                            checked={platformFilter === platform}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            className="mr-3 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">
                            {platform === 'all' ? 'All Platforms' : platform}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
                <div className="space-y-2">
                  {[
                    { field: 'date', label: 'Date' },
                    { field: 'price', label: 'Price' },
                    { field: 'item', label: 'Item' },
                    { field: 'type', label: 'Type' },
                    { field: 'platform', label: 'Platform' }
                  ].map(option => (
                    <label key={option.field} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="sortField"
                          value={option.field}
                          checked={sortField === option.field}
                          onChange={(e) => handleSort(e.target.value as SortField)}
                          className="mr-3 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                      {sortField === option.field && (
                        <button
                          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </button>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Table */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your transactions...</p>
                </div>
              ) : sortedTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-2">🗂️</div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {transactions.length === 0 ? 'No Transactions Found' : 'No Transactions Match Filters'}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {transactions.length === 0 
                      ? 'Start adding your purchases and sales to track your flipping journey.'
                      : 'Try adjusting your filters to see more results.'
                    }
                  </p>
                  {transactions.length === 0 && (
                    <Link href="/account" className="btn-primary">Add Your First Transaction</Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50" onClick={() => handleSort('item')}>
                          <div className="flex items-center">
                            Item
                            {sortField === 'item' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50" onClick={() => handleSort('type')}>
                          <div className="flex items-center">
                            Type
                            {sortField === 'type' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50" onClick={() => handleSort('price')}>
                          <div className="flex items-center">
                            Price
                            {sortField === 'price' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50" onClick={() => handleSort('platform')}>
                          <div className="flex items-center">
                            Platform
                            {sortField === 'platform' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50" onClick={() => handleSort('date')}>
                          <div className="flex items-center">
                            Date
                            {sortField === 'date' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sortedTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-800">{tx.item}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{tx.type.toUpperCase()}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-800 font-semibold">${parseFloat(tx.price).toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-600">{tx.platform || '—'}</td>
                          <td className="px-4 py-3 text-gray-600">{new Date(tx.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 