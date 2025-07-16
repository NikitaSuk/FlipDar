import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';

const popularItems = [
  'iPhone 14 Pro',
  'PS5 Console',
  'Air Jordan 1',
  'MacBook Pro'
];

const itemImages: Record<string, string> = {
  'iPhone 14 Pro': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop',
  'PS5 Console': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200&h=200&fit=crop',
  'Air Jordan 1': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop',
  'MacBook Pro': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
  'LEGO Star Wars': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop',
  'Nintendo Switch': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
  'Apple Watch': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop',
  'GoPro Hero': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop',
  'Canon EOS': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop',
  'Yeezy Boost': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop',
};

const EBAY_COMPLETED_URL = 'https://www.ebay.com/sch/i.html?_nkw=';

async function fetchEbayStats(item: string) {
  const url = `${EBAY_COMPLETED_URL}${encodeURIComponent(item)}&_sacat=0&LH_Sold=1&LH_Complete=1`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const html = await response.text();
  const $ = load(html);
  const prices: number[] = [];
  $("span.s-item__price").each((_, el) => {
    const text = $(el).text().replace(/[^\d.]/g, '');
    const price = parseFloat(text);
    if (!isNaN(price) && price > 0) prices.push(price);
  });
  const avg_price = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  return {
    item,
    avg_price: Math.round(avg_price * 100) / 100,
    image_url: itemImages[item] || '',
    result_count: prices.length
  };
}

export async function GET(req: NextRequest) {
  try {
    const results = await Promise.all(
      popularItems.map(async (item) => {
        try {
          const stats = await fetchEbayStats(item);
          return stats || {
            item,
            avg_price: 0,
            image_url: itemImages[item] || '',
            result_count: 0
          };
        } catch {
          return {
            item,
            avg_price: 0,
            image_url: itemImages[item] || '',
            result_count: 0
          };
    }
      })
    );
    return NextResponse.json({ items: results });
  } catch (error: any) {
    console.error('Trending items scraping error:', error);
    return NextResponse.json({ 
      error: 'Trending items service temporarily unavailable.' 
    }, { status: 503 });
  }
} 