"use client";
import { useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AccountCircle() {
  const session = useSession();

  if (!session?.user) {
    return null;
  }

  const avatarUrl = session.user.user_metadata?.avatar_url;
  const fullName = session.user.user_metadata?.full_name || '';
  const email = session.user.email || '';
  const initials = fullName 
    ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : email[0]?.toUpperCase() || 'U';

  return (
    <Link href="/account" className="flex items-center justify-center">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold text-sm">
            {initials}
          </div>
        )}
      </div>
    </Link>
  );
} 