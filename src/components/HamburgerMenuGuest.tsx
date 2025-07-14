"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="transition-all duration-500 ease-in-out" aria-hidden="true">
      <path
        d={open
          ? 'M6 6L22 22M6 22L22 6'
          : 'M5 8h18M5 14h18M5 20h18'
        }
        stroke="#222"
        strokeWidth={2.5}
        strokeLinecap="round"
        className="transition-all duration-500 ease-in-out"
      />
      {open ? null : (
        <>
          <line x1="5" y1="14" x2="23" y2="14" stroke="#222" strokeWidth={2.5} strokeLinecap="round" className="transition-all duration-500 ease-in-out" />
          <line x1="5" y1="20" x2="23" y2="20" stroke="#222" strokeWidth={2.5} strokeLinecap="round" className="transition-all duration-500 ease-in-out" />
        </>
      )}
    </svg>
  );
}

export default function HamburgerMenuGuest() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { section: 'Navigation', items: [
      { href: '/', label: 'Home', icon: '🏠' },
    ]},
    { section: 'Support', items: [
      { href: '/faq', label: 'FAQ', icon: '❓' },
      { href: '/contact', label: 'Contact', icon: '📧' },
    ]},
    { section: 'Account', items: [
      { href: '/login', label: 'Login', icon: '🔑' },
      { href: '/signup', label: 'Sign Up', icon: '📝' },
    ]},
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="Menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <HamburgerIcon open={isOpen} />
      </button>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 py-4 px-2 transition-all duration-500 ease-in-out transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
        ${isOpen ? 'visible' : 'invisible'}`}
        role="menu"
        aria-label="Main menu"
        style={{ minWidth: 280 }}
      >
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