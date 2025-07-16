"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Default trending items (fallback)
const defaultTrendingItems = [
  { name: "iPhone 14 Pro", price: 850, img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop", count: 150 },
  { name: "PS5 Console", price: 500, img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200&h=200&fit=crop", count: 89 },
  { name: "Air Jordan 1", price: 320, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop", count: 234 },
  { name: "MacBook Pro", price: 1200, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop", count: 67 },
];

export default function FlipDarDashboard() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const pathname = usePathname();
  const [item, setItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searchError, setSearchError] = useState('');
  const [searchSaveError, setSearchSaveError] = useState('');
  const [trendingItems, setTrendingItems] = useState(defaultTrendingItems);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSearches: 0,
    avgProfitMargin: 22,
    fastestFlip: 2,
    userCountries: 30
  });

  useEffect(() => {
    if (!session) return;
    fetchTrendingData();
  }, [session]);

  const fetchTrendingData = async () => {
    setTrendingLoading(true);
    try {
      const trendingResponse = await fetch('/api/trending-items');
      if (trendingResponse.ok) {
        const trendingData = await trendingResponse.json();
        if (trendingData.items && trendingData.items.length > 0) {
          const trending = trendingData.items.map((row: any) => ({
            name: row.item,
            price: row.avg_price,
            img: row.image_url,
            count: row.result_count
          }));
          setTrendingItems(trending);
        }
      }
      const { count: totalSearches } = await supabase
        .from('search_history')
        .select('*', { count: 'exact', head: true });
      setStats(prev => ({
        ...prev,
        totalSearches: totalSearches || 0
      }));
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setTrendingLoading(false);
    }
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSearchError('');
    setSearchSaveError('');
    try {
      const res = await fetch('/api/ebay-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setSearchError(data.error || 'Error fetching data');
      }
    } catch (err: any) {
      setSearchError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const bgGradient = "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50";

  return (
    <div className={`min-h-screen ${bgGradient} flex flex-col items-center transition-colors`}>
      <header className="w-full py-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 drop-shadow tracking-tight">Welcome to FlipDar!</h1>
      </header>
      <main className="w-full max-w-4xl flex flex-col md:flex-row gap-10">
        {/* Search and Results */}
        <section className="flex-1 glass-card p-8 mb-8 md:mb-0">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
            <input
              type="text"
              placeholder="Enter item to search (e.g. iPhone 12)"
              value={item}
              onChange={e => setItem(e.target.value)}
              required
              className="w-full"
              disabled={!session}
            />
            <button type="submit" className="btn-primary w-full" disabled={!session || loading}>
              {session ? (loading ? 'Searching...' : 'Search') : 'Sign in to Search'}
            </button>
            {!session && (
              <div className="text-center text-sm text-gray-500 mt-2">
                <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className="text-blue-600 underline">Sign in</Link> or <Link href={`/signup?redirect=${encodeURIComponent(pathname)}`} className="text-blue-600 underline">Sign up</Link> to use FlipDar analytics.
              </div>
            )}
          </form>
          {searchError && <div className="text-red-500 mb-4">{searchError}</div>}
          {searchSaveError && <div className="text-red-500 mb-2">{searchSaveError}</div>}
          {result && (
            <div className="glass-card p-4">
              <h2 className="text-lg font-bold mb-2 text-gray-800">Results for "{result.item}"</h2>
              <div>Average Sold Price: <b>${result.avgPrice?.toFixed(2) ?? 'N/A'}</b></div>
              <div>Average Listing Duration: <b>{result.avgDuration ? result.avgDuration.toFixed(2) + ' days' : 'N/A'}</b></div>
              <div>Price Range: <b>${result.minPrice?.toFixed(2) ?? 'N/A'} - ${result.maxPrice?.toFixed(2) ?? 'N/A'}</b></div>
              <div>Number of Sales: <b>{result.count}</b></div>
            </div>
          )}
        </section>
        {/* Trending and Stats Panel */}
        <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-8">
          <div className="glass-card p-6">
            <h3 className="font-bold text-gray-700 mb-2">Trending Searches</h3>
            {trendingLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                    <div className="h-4 bg-gray-300 rounded flex-1"></div>
                    <div className="h-4 bg-gray-300 rounded w-12"></div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {trendingItems.map((item) => (
                  <li key={item.name} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      <Image 
                        src={item.img} 
                        alt={item.name} 
                        width={40} 
                        height={40} 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop";
                        }}
                      />
                    </div>
                    <span className="font-medium text-gray-800 flex-1">{item.name}</span>
                    <span className="text-gray-500 text-sm">${item.price?.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="glass-card p-6">
            <h3 className="font-bold text-gray-700 mb-2">Useful Stats</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>🔎 Over <b>{stats.totalSearches}</b> items analyzed</li>
              <li>💸 Avg. profit margin: <b>{stats.avgProfitMargin}%</b></li>
              <li>⏱️ Fastest flip: <b>{stats.fastestFlip} hours</b></li>
              <li>🌎 Users in <b>{stats.userCountries}+ countries</b></li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
} 