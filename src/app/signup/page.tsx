"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useSession } from '@supabase/auth-helpers-react';
import Link from "next/link";

export default function SignupPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const session = useSession();
  // Redirect if already logged in
  if (session?.user) {
    if (typeof window !== 'undefined') router.replace('/account');
    return null;
  }
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTos, setAcceptedTos] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation checks
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const isLongEnough = password.length > 10;
  const allValid = isLongEnough && hasNumber && hasLetter && hasSymbol;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!allValid) {
      setError('Password must be more than 10 characters and include a number, a letter, and a symbol.');
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
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.trim().toLowerCase() }
      }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 p-4">
      <div className="glass-card w-full max-w-md flex flex-col gap-2 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
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
          <PasswordRequirements password={password} />
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
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <div className="text-center text-sm mt-2">
            Have an account?{' '}
            <Link href="/login" className="text-green-700 hover:underline">Sign In</Link>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}

function PasswordRequirements({ password }: { password: string }) {
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const isLongEnough = password.length > 10;
  return (
    <ul className="mt-2 text-xs grid grid-cols-2 gap-x-4 gap-y-1">
      <li className={isLongEnough ? "text-green-600" : "text-gray-500"}>
        {isLongEnough ? "✔" : "✗"} More than 10 characters
      </li>
      <li className={hasLetter ? "text-green-600" : "text-gray-500"}>
        {hasLetter ? "✔" : "✗"} Contains a letter
      </li>
      <li className={hasNumber ? "text-green-600" : "text-gray-500"}>
        {hasNumber ? "✔" : "✗"} Contains a number
      </li>
      <li className={hasSymbol ? "text-green-600" : "text-gray-500"}>
        {hasSymbol ? "✔" : "✗"} Contains a symbol
      </li>
    </ul>
  );
}

// export for use in the home page bubble
export { PasswordRequirements }; 