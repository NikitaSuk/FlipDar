"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';

export default function AuthModal({ open, onClose, initialMode = "login" }: { open: boolean, onClose: () => void, initialMode?: "login" | "signup" }) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTos, setAcceptedTos] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onClose();
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!acceptedTos) {
      setError("You must accept the Privacy Policy and Terms of Service.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username.trim().toLowerCase() } }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">×</button>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{mode === "login" ? "Sign In" : "Sign Up"}</h2>
          <p className="text-gray-500 text-sm">{mode === "login" ? "Welcome back!" : "Create your FlipDar account."}</p>
        </div>
        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          )}
          {mode === "signup" && (
            <label className="flex items-center gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={acceptedTos}
                onChange={e => setAcceptedTos(e.target.checked)}
                className="accent-green-500"
                required
              />
              I agree to the <a href="/privacy" target="_blank" className="underline">Privacy Policy</a> and <a href="/terms" target="_blank" className="underline">Terms of Service</a>.
            </label>
          )}
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (mode === "login" ? "Signing In..." : "Signing Up...") : (mode === "login" ? "Sign In" : "Sign Up")}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-500">
          {mode === "login" ? (
            <>Don't have an account? <button className="text-green-600 hover:underline" onClick={() => setMode("signup")}>Sign up</button></>
          ) : (
            <>Already have an account? <button className="text-green-600 hover:underline" onClick={() => setMode("login")}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
} 