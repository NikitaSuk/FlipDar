"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useProtectedRoute } from '../../../hooks/useProtectedRoute';
import PasswordRequirements from '../../components/PasswordRequirements';

export default function ChangePasswordPage() {
  const { session, isLoading } = useProtectedRoute();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password validation checks
  const hasNumber = /[0-9]/.test(newPassword);
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasSymbol = /[^a-zA-Z0-9]/.test(newPassword);
  const isLongEnough = newPassword.length > 10;
  const allValid = isLongEnough && hasNumber && hasLetter && hasSymbol;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!allValid) {
      setError("Password must be more than 10 characters and include a number, a letter, and a symbol.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    // Supabase requires re-authentication for password change. Sign in first.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session?.user?.email,
      password: currentPassword,
    });
    if (signInError) {
      setError("Current password is incorrect.");
      setLoading(false);
      return;
    }
    // Now update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);
    if (updateError) {
      setError(updateError.message || "Failed to update password.");
    } else {
      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // setTimeout(() => router.push("/account/settings"), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 p-4">
      <div className="w-full max-w-md mt-12 bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Change Password</h1>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              autoComplete="new-password"
            />
            <PasswordRequirements password={newPassword} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              autoComplete="new-password"
            />
          </div>
          {error && <div className="text-red-600 text-sm text-right">{error}</div>}
          {success && <div className="text-green-600 text-sm text-right">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
        <div className="mt-6 text-center">
          {/* <Link href="/account/settings" className="text-gray-500 hover:underline">Back to Settings</Link> */}
        </div>
      </div>
    </div>
  );
} 