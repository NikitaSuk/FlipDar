"use client";
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function AccountCenterPage() {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    // TODO: Implement delete account logic
    setTimeout(() => {
      setDeleting(false);
      alert('Account deletion is not implemented yet.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-3xl">
          {user?.user_metadata?.full_name
            ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
            : user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="font-bold text-lg text-gray-800 mb-1">{user?.user_metadata?.full_name || user?.email || 'User'}</div>
        <div className="text-gray-400 text-sm mb-6">{user?.email}</div>
        <div className="w-full flex flex-col gap-4">
          <Link href="/account/change-password" className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-center font-medium">
            Change Password
          </Link>
          <Link href="/account/privacy" className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-center font-medium">
            Privacy & Security
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
} 