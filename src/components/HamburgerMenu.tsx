"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import Image from 'next/image';

function HamburgerIcon({ open }: { open: boolean }) {
  // SVG path morphs between hamburger and X
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="transition-all duration-500 ease-in-out" aria-hidden="true">
      <path
        d={open
          ? 'M6 6L22 22M6 22L22 6' // X
          : 'M5 8h18M5 14h18M5 20h18' // Hamburger
        }
        stroke="#222"
        strokeWidth={2.5}
        strokeLinecap="round"
        className="transition-all duration-500 ease-in-out"
      />
      {/* For hamburger, show 3 lines; for X, show 2 lines. We'll animate the path. */}
      {open ? null : (
        <>
          <line x1="5" y1="14" x2="23" y2="14" stroke="#222" strokeWidth={2.5} strokeLinecap="round" className="transition-all duration-500 ease-in-out" />
          <line x1="5" y1="20" x2="23" y2="20" stroke="#222" strokeWidth={2.5} strokeLinecap="round" className="transition-all duration-500 ease-in-out" />
        </>
      )}
    </svg>
  );
}

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, user } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { section: 'Navigation', items: [
      { href: '/', label: 'Home', icon: '🏠' },
      { href: '/account', label: 'Dashboard', icon: '📊' },
    ]},
    { section: 'Account', items: [
      { href: '/account/subscription', label: 'Subscription', icon: '💳' },
      { href: '/account/analytics', label: 'Analytics', icon: '📈' },
      { href: '/account/transactions', label: 'All Transactions', icon: '📝' },
      { href: '/account/settings', label: 'Settings', icon: '⚙️' },
    ]},
    { section: 'Support', items: [
      { href: '/faq', label: 'FAQ', icon: '❓' },
      { href: '/contact', label: 'Contact', icon: '📧' },
      { href: '/suggestions', label: 'Suggestions & Feedback', icon: '💡' },
    ]},
  ];

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener when menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="Menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <HamburgerIcon open={isOpen} />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      
      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 py-4 px-2 transition-all duration-500 ease-in-out transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
        ${isOpen ? 'visible' : 'invisible'}`}
        role="menu"
        aria-label="Main menu"
        style={{ minWidth: 280 }}
      >
        {/* User Info */}
        {user && (
          <div className="px-4 py-4 border-b border-gray-100 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-lg">
                    {user.user_metadata?.full_name 
                      ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                      : user.email?.[0]?.toUpperCase() || 'U'
                    }
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 truncate">
                  {user.user_metadata?.full_name || 'User'}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {user.user_metadata?.username ? `@${user.user_metadata.username}` : user.email}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((section) => (
            <div key={section.section} className="mb-3">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.section}
              </div>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200 rounded-lg text-base font-medium focus:bg-gray-100 focus:outline-none"
                    role="menuitem"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 