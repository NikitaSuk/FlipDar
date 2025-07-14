import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';

const EBAY_COMPLETED_URL = 'https://www.ebay.com/sch/i.html?_nkw=';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { item } = body;

    if (!item || item.trim() === '') {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    // Build eBay completed listings URL
    const url = `${EBAY_COMPLETED_URL}${encodeURIComponent(item)}&_sacat=0&LH_Sold=1&LH_Complete=1`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`eBay scraping error: ${response.status}`);
    }
    const html = await response.text();
    const $ = load(html);

    // Parse sold item prices
    const prices: number[] = [];
    $("span.s-item__price").each((_, el) => {
      const text = $(el).text().replace(/[^\d.]/g, '');
      const price = parseFloat(text);
      if (!isNaN(price) && price > 0) prices.push(price);
    });

    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return NextResponse.json({
      item: item,
      avgPrice: Math.round(avgPrice * 100) / 100,
      minPrice: Math.round(minPrice * 100) / 100,
      maxPrice: Math.round(maxPrice * 100) / 100,
      count: prices.length,
      message: prices.length > 0 ? `Found ${prices.length} sold listings` : 'No sold listings found for this item'
    });
  } catch (error: any) {
    console.error('eBay scraping error:', error);
    return NextResponse.json({ 
      error: 'Unable to fetch eBay data. Please try again later.',
      details: error.message
    }, { status: 503 });
  }
}
