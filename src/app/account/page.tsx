"use client";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/');
      return;
    }
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error } = await supabase
          .from('search_history')
          .select('*')
          .eq('user_id', session.user.id)
          .order('searched_at', { ascending: false });
        if (error) throw error;
        setSearchHistory(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch search history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [session, supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setDeleting(true);
    setError('');
    try {
      // This requires a backend function or admin API; placeholder for now
      setTimeout(() => {
        setDeleting(false);
        alert('Account deletion is not implemented in this demo.');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-2xl glass-card p-8 mt-10">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Account</h1>
        <div className="mb-4 text-gray-700">Signed in as <b>{session.user.email}</b></div>
        <button onClick={handleSignOut} className="btn-primary mb-4">Sign Out</button>
        <button onClick={handleDeleteAccount} className="btn-danger mb-4" disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">Your Search History</h2>
        {loading ? (
          <div>Loading...</div>
        ) : searchHistory.length === 0 ? (
          <div className="text-gray-500">No searches yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {searchHistory.map((item) => (
              <li key={item.id} className="py-3 flex flex-col md:flex-row md:items-center gap-2">
                <span className="font-medium text-gray-800 flex-1">{item.item}</span>
                <span className="text-gray-500 text-sm">Avg: ${item.avg_price?.toFixed(2) ?? 'N/A'}</span>
                <span className="text-gray-400 text-xs">{new Date(item.searched_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 