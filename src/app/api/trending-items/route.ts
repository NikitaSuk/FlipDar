import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Mock trending items data
    const mockTrendingItems = [
      {
        item: "iPhone 14 Pro",
        avg_price: 850,
        image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop",
        result_count: 150
      },
      {
        item: "PS5 Console",
        avg_price: 500,
        image_url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200&h=200&fit=crop",
        result_count: 89
      },
      {
        item: "Air Jordan 1",
        avg_price: 320,
        image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
        result_count: 234
      },
      {
        item: "MacBook Pro",
        avg_price: 1200,
        image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop",
        result_count: 67
      }
    ];

    return NextResponse.json({ items: mockTrendingItems });
  } catch (error: any) {
    console.error('Trending items API error:', error);
    return NextResponse.json({ 
      error: 'Trending items service temporarily unavailable.' 
    }, { status: 503 });
  }
} 