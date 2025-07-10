import { NextRequest, NextResponse } from 'next/server';

const staticItems = [
  'iPhone 14 Pro', 'PS5 Console', 'Air Jordan 1', 'MacBook Pro', 'LEGO Star Wars',
  'Nike Dunk Low', 'iPad Pro', 'Samsung Galaxy S23', 'Nintendo Switch', 'Xbox Series X',
  'Apple Watch', 'GoPro Hero', 'Bose Headphones', 'Canon EOS', 'Fitbit', 'Google Pixel',
  'Yeezy Boost', 'Kindle Paperwhite', 'Dyson Vacuum', 'Roomba', 'Oculus Quest'
];

export async function GET(req: NextRequest) {
  // For now, just return static suggestions to avoid auth issues
  // In the future, we can add user-specific suggestions when needed
  return NextResponse.json({ suggestions: staticItems });
} 