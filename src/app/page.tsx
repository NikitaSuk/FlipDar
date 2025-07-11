"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

// Default trending items (fallback)
const defaultTrendingItems = [
  { name: "iPhone 14 Pro", price: 850, img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop", count: 150 },
  { name: "PS5 Console", price: 500, img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200&h=200&fit=crop", count: 89 },
  { name: "Air Jordan 1", price: 320, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop", count: 234 },
  { name: "MacBook Pro", price: 1200, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop", count: 67 },
];

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [error, setError] = useState('');
  const [item, setItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searchError, setSearchError] = useState('');
  
  // Dynamic data state
  const [trendingItems, setTrendingItems] = useState(defaultTrendingItems);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSearches: 0,
    avgProfitMargin: 22,
    fastestFlip: 2,
    userCountries: 30
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fuse, setFuse] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTos, setAcceptedTos] = useState(false);

  // Fetch trending items and stats
  const fetchTrendingData = async () => {
    setTrendingLoading(true);
    try {
      // Get trending items with images from our new API
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

      // Get aggregate stats
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

  // Fetch suggestions on mount
  useEffect(() => {
    fetch('/api/suggestions')
      .then(res => res.json())
      .then(data => {
        setSuggestions(data.suggestions || []);
        setFuse(new Fuse(data.suggestions || [], { threshold: 0.4 }));
      });
  }, []);

  // Update filtered suggestions as user types
  useEffect(() => {
    if (item && fuse) {
      setFilteredSuggestions(fuse.search(item).map((r: any) => r.item).slice(0, 8));
    } else {
      setFilteredSuggestions([]);
    }
  }, [item, fuse]);

  useEffect(() => {
    fetchTrendingData();
  }, []);

  useEffect(() => {
    if (session) {
      fetchTrendingData();
    }
  }, [session]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (authMode === 'sign-up') {
      if (!username.trim()) {
        setError('Username is required.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!acceptedTos) {
        setError('You must accept the Privacy Policy and Terms of Service.');
        return;
      }
    }
    let result;
    console.log('supabase.auth:', supabase.auth); // DEBUG
    if (authMode === 'sign-in') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: username.trim().toLowerCase() }
        }
      });
    }
    if (result.error) setError(result.error.message);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSearchError('');
    try {
      const res = await fetch('/api/ebay-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        // Save search to Supabase for trending analytics
        if (session?.user?.id) {
          try {
            const { error: insertError } = await supabase.from('search_history').insert({
              user_id: session.user.id,
              item: item,
              avg_price: data.avgPrice,
              min_price: data.minPrice,
              max_price: data.maxPrice,
              avg_duration: data.avgDuration,
              result_count: data.count,
            });
            
            if (insertError) {
              console.error('Error saving search history:', insertError);
            } else {
              console.log('Search history saved successfully');
            }
          } catch (saveError) {
            console.error('Error saving search history:', saveError);
          }
        }
      } else {
        setSearchError(data.error || 'Error fetching data');
      }
    } catch (err: any) {
      setSearchError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Grayscale background
  const bgGradient = "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50";

  if (!session) {
    return (
      <div className={`min-h-screen ${bgGradient} flex flex-col items-center transition-colors`}>
        <header className="w-full py-12 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <Image 
              src="/flipdar.png" 
              alt="FlipDar Logo" 
              width={80} 
              height={80} 
              className="rounded-xl shadow-lg"
            />
            <h1 className="text-6xl font-extrabold text-gray-800 drop-shadow-lg tracking-tight">FlipDar</h1>
          </div>
          <p className="text-2xl text-gray-600 mb-8 max-w-2xl text-center font-medium">The ultimate tool for resellers and flippers. Instantly analyze second-hand market trends, get real eBay stats, and discover what’s hot right now!</p>
          <div className="glass-card w-full max-w-md flex flex-col gap-2 p-8">
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {authMode === 'sign-up' && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {authMode === 'sign-up' && (
                <>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                  <label className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                    <input
                      type="checkbox"
                      checked={acceptedTos}
                      onChange={e => setAcceptedTos(e.target.checked)}
                      required
                    />
                    I agree to the
                    <Link href="/privacy" className="underline hover:text-green-700">Privacy Policy</Link>
                    and
                    <Link href="/terms" className="underline hover:text-green-700">Terms of Service</Link>
                  </label>
                </>
              )}
              <button type="submit" className="btn-primary">
                {authMode === 'sign-in' ? 'Sign In' : 'Sign Up'}
              </button>
              <button
                type="button"
                className="text-gray-700 underline text-sm mt-2"
                onClick={() => setAuthMode(authMode === 'sign-in' ? 'sign-up' : 'sign-in')}
              >
                {authMode === 'sign-in' ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
              </button>
              {error && <div className="text-red-500 text-center">{error}</div>}
            </form>
          </div>
        </header>
        {/* Features */}
        <section className="w-full max-w-4xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 flex flex-col items-center">
            <span className="text-4xl mb-2">📈</span>
            <h2 className="font-bold text-lg mb-1 text-gray-800">Real eBay Stats</h2>
            <p className="text-gray-500 text-center">Get average sold prices, listing durations, and more for any item.</p>
          </div>
          <div className="glass-card p-8 flex flex-col items-center">
            <span className="text-4xl mb-2">🔥</span>
            <h2 className="font-bold text-lg mb-1 text-gray-800">Trending Items</h2>
            <p className="text-gray-500 text-center">See what’s hot and selling fast in the second-hand market.</p>
          </div>
          <div className="glass-card p-8 flex flex-col items-center">
            <span className="text-4xl mb-2">💡</span>
            <h2 className="font-bold text-lg mb-1 text-gray-800">Flip Smarter</h2>
            <p className="text-gray-500 text-center">Make data-driven decisions to maximize your profits.</p>
          </div>
        </section>
        {/* Trending Items */}
        <section className="w-full max-w-4xl mt-20 mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Trending Now</h2>
          {trendingLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-4 flex flex-col items-center animate-pulse">
                  <div className="w-24 h-24 bg-gray-300 rounded-xl mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {trendingItems.map((item) => (
                <div key={item.name} className="glass-card p-4 flex flex-col items-center hover:shadow-lg transition-shadow">
                  <div className="w-24 h-24 bg-gray-200 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                    <Image 
                      src={item.img} 
                      alt={item.name} 
                      width={96} 
                      height={96} 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Fallback to default image if loading fails
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop";
                      }}
                    />
                  </div>
                  <div className="font-semibold text-gray-800 text-center">{item.name}</div>
                  <div className="text-gray-500 text-sm">Avg. ${item.price?.toLocaleString()}</div>
                  {item.count && (
                    <div className="text-gray-400 text-xs">{item.count} sales</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        <footer className="w-full py-6 text-center text-gray-400 text-sm border-t mt-auto">
          <div className="flex flex-col items-center gap-2">
            <div>© {new Date().getFullYear()} FlipDar. All rights reserved.</div>
            <div className="flex gap-4 text-xs">
              <Link href="/privacy" className="hover:text-gray-600 transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-600 transition">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated user view
  return (
    <div className={`min-h-screen ${bgGradient} flex flex-col items-center transition-colors`}>
      <header className="w-full py-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 drop-shadow tracking-tight">Welcome to FlipDar!</h1>
      </header>
      <main className="w-full max-w-4xl flex flex-col md:flex-row gap-10">
        {/* Search and Results */}
        <section className="flex-1 glass-card p-8 mb-8 md:mb-0">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter item to search (e.g. iPhone 12)"
                value={item}
                onChange={e => { setItem(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                required
                className="w-full"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border rounded shadow z-10 max-h-48 overflow-y-auto">
                  {filteredSuggestions.map(s => (
                    <li
                      key={s}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => { setItem(s); setShowSuggestions(false); }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {searchError && <div className="text-red-500 mb-4">{searchError}</div>}
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
      <footer className="w-full py-6 text-center text-gray-400 text-sm border-t mt-auto">
        <div className="flex flex-col items-center gap-2">
          <div>© {new Date().getFullYear()} FlipDar. All rights reserved.</div>
          <div className="flex gap-4 text-xs">
            <Link href="/privacy" className="hover:text-gray-600 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
