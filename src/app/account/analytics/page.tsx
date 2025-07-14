"use client";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProtectedRoute } from '../../../hooks/useProtectedRoute';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';

const ChartIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📊</span>;
const TrendingIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📈</span>;
const CalendarIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">📅</span>;
const TargetIcon = () => <span className="inline-block w-5 h-5 mr-2 align-middle">🎯</span>;

export default function AnalyticsPage() {
  const { session, isLoading } = useProtectedRoute();
  const [transactions, setTransactions] = useState<any[]>([]);
  // Remove searchHistory state
  // const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    if (!session?.user?.id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch transactions
        const txResponse = await fetch(`/api/transactions?userId=${session.user.id}`);
        const txData = await txResponse.json();
        setTransactions(txData.transactions || []);

        // Remove search history fetch
        // const searchResponse = await fetch(`/api/account/history?userId=${session.user.id}`);
        // const searchData = await searchResponse.json();
        // setSearchHistory(searchData.history || []);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Calculate analytics
  const calculateAnalytics = () => {
    if (!transactions.length) return null;

    const sales = transactions.filter(tx => tx.type === 'sale');
    const purchases = transactions.filter(tx => tx.type === 'purchase');
    
    const totalSales = sales.reduce((sum, tx) => sum + parseFloat(tx.price), 0);
    const totalPurchases = purchases.reduce((sum, tx) => sum + parseFloat(tx.price), 0);
    const totalProfit = totalSales - totalPurchases;
    const profitMargin = totalPurchases > 0 ? (totalProfit / totalPurchases) * 100 : 0;
    
    const avgSalePrice = sales.length > 0 ? totalSales / sales.length : 0;
    const avgPurchasePrice = purchases.length > 0 ? totalPurchases / purchases.length : 0;

    // Most profitable items
    const itemProfits: { [key: string]: number } = {};
    purchases.forEach(purchase => {
      const item = purchase.item;
      const matchingSales = sales.filter(sale => sale.item === item);
      const purchasePrice = parseFloat(purchase.price);
      const totalSalePrice = matchingSales.reduce((sum, sale) => sum + parseFloat(sale.price), 0);
      itemProfits[item] = (itemProfits[item] || 0) + (totalSalePrice - purchasePrice);
    });

    const topItems = Object.entries(itemProfits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      totalSales,
      totalPurchases,
      totalProfit,
      profitMargin,
      avgSalePrice,
      avgPurchasePrice,
      salesCount: sales.length,
      purchasesCount: purchases.length,
      topItems
    };
  };

  const analytics = calculateAnalytics();

  // Helper: group transactions by date and calculate cumulative profit, cost, and sold
  function getProfitTrendData(transactions: any[]) {
    // Sort by date ascending
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const data: Record<string, { date: string, cost: number, sold: number, profit: number }> = {};
    let cumulativeCost = 0;
    let cumulativeSold = 0;
    let cumulativeProfit = 0;
    // For realized profit: track unmatched purchases per item (FIFO)
    const purchaseQueues: Record<string, number[]> = {};
    sorted.forEach(tx => {
      const d = new Date(tx.date);
      const dateStr = d.toLocaleDateString();
      if (!data[dateStr]) {
        data[dateStr] = { date: dateStr, cost: cumulativeCost, sold: cumulativeSold, profit: cumulativeProfit };
      }
      if (tx.type === 'purchase') {
        cumulativeCost += parseFloat(tx.price);
        // Track purchase for FIFO matching
        if (!purchaseQueues[tx.item]) purchaseQueues[tx.item] = [];
        purchaseQueues[tx.item].push(parseFloat(tx.price));
      } else if (tx.type === 'sale') {
        cumulativeSold += parseFloat(tx.price);
        // Realized profit: match to earliest unmatched purchase
        let matchedPurchase = 0;
        if (purchaseQueues[tx.item] && purchaseQueues[tx.item].length > 0) {
          matchedPurchase = purchaseQueues[tx.item].shift()!;
        }
        cumulativeProfit += parseFloat(tx.price) - matchedPurchase;
      }
      data[dateStr] = {
        date: dateStr,
        cost: cumulativeCost,
        sold: cumulativeSold,
        profit: cumulativeProfit
      };
    });
    // Return as array sorted by date
    return Object.values(data).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // This will be handled by useProtectedRoute
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl mt-8">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute left-0 top-0">
            <Link href="/account" className="text-gray-600 hover:text-gray-800">← Back to Account</Link>
          </div>
          <div className="absolute right-0 top-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        ) : !analytics ? (
          <div className="text-center py-12">
            <ChartIcon />
            <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">No Data Yet</h2>
            <p className="text-gray-600 mb-4">Start adding transactions to see your analytics</p>
            <Link href="/account" className="btn-primary">
              Add Your First Transaction
            </Link>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Profit</p>
                    <p className={`text-2xl font-bold ${analytics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${analytics.totalProfit.toFixed(2)}
                    </p>
                  </div>
                  <TrendingIcon />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Profit Margin</p>
                    <p className={`text-2xl font-bold ${analytics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analytics.profitMargin.toFixed(1)}%
                    </p>
                  </div>
                  <TargetIcon />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Items Sold</p>
                    <p className="text-2xl font-bold text-gray-800">{analytics.salesCount}</p>
                  </div>
                  <CalendarIcon />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Sale Price</p>
                    <p className="text-2xl font-bold text-gray-800">${analytics.avgSalePrice.toFixed(2)}</p>
                  </div>
                  <ChartIcon />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Profit Trend */}
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📈</span> Profit Trend
                </h3>
                <div className="h-72 w-full">
                  {transactions.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getProfitTrendData(transactions)} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e42" stopOpacity={0.18}/>
                            <stop offset="95%" stopColor="#f59e42" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={60} />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px #0001' }}
                          labelStyle={{ color: '#334155', fontWeight: 600 }}
                          formatter={(value: any, name: string, props: any) => [
                            `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                            name.charAt(0).toUpperCase() + name.slice(1)
                          ]}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: 8 }} />
                        <Area type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" dot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} name="Profit" />
                        <Area type="monotone" dataKey="sold" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSold)" dot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} name="Sold" />
                        <Area type="monotone" dataKey="cost" stroke="#f59e42" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" dot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} name="Cost" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <div className="text-4xl mb-2">📈</div>
                      <p>No data yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Performing Items */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Items</h3>
                {analytics.topItems.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topItems.map(([item, profit], index) => (
                      <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                          <span className="font-medium text-gray-800">{item}</span>
                        </div>
                        <span className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${profit.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No completed flips yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Search Analytics */}
            {/* Remove the entire Search Analytics section */}
            {/* <div className="bg-white rounded-2xl shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{searchHistory.length}</p>
                  <p className="text-sm text-gray-600">Total Searches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {searchHistory.length > 0 ? 
                      (searchHistory.reduce((sum, search) => sum + (search.avg_price || 0), 0) / searchHistory.length).toFixed(2) : 
                      '0'
                    }
                  </p>
                  <p className="text-sm text-gray-600">Avg Search Price</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {new Set(searchHistory.map(s => s.item)).size}
                  </p>
                  <p className="text-sm text-gray-600">Unique Items Searched</p>
                </div>
              </div>
            </div> */}

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold mr-3 ${
                        tx.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {tx.type.toUpperCase()}
                      </span>
                      <span className="font-medium text-gray-800">{tx.item}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">${parseFloat(tx.price).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 