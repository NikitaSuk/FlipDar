"use client";
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PrivacySecurityPage() {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

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
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Privacy & Security</h1>
        <p className="text-gray-700 mb-4 text-center">
          At FlipDar, your privacy and security are our top priorities. We do <span className="font-semibold">not</span> sell, share, or use your data for advertising or third-party purposes. All your information is stored securely and only used to provide you with the features of the app.
        </p>
        <ul className="text-gray-600 mb-6 list-disc list-inside text-left w-full max-w-md">
          <li>We use strong encryption for all sensitive data.</li>
          <li>Your account and transaction data are never shared with third parties.</li>
          <li>We only store the minimum data required for your account and analytics.</li>
          <li>You can delete your account and all associated data at any time.</li>
        </ul>
        <div className="w-full flex flex-col gap-4 mt-8">
          <button
            onClick={handleDeleteAccount}
            className="w-full py-3 px-4 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition font-medium disabled:opacity-50"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
          <a
            href="/privacy"
            className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-center font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Full Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
} 