"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import Link from "next/link";

function ClientLoginForm() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  useEffect(() => {
    if (session?.user) {
      router.replace(redirect);
      router.refresh();
    }
  }, [session, router, redirect]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace(redirect);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 p-4">
      <div className="glass-card w-full max-w-md flex flex-col gap-2 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 pb-0 pt-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="pl-2 text-left -mt-4">
            <Link href="/forgot-password" className="text-xs text-green-700 hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className="text-center text-sm mt-2">
            Need an account?{' '}
            <Link href="/signup" className="text-green-700 hover:underline">Sign Up</Link>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <ClientLoginForm />;
} 