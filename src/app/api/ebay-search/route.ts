import { NextRequest, NextResponse } from 'next/server';

// eBay Finding API endpoint for completed items (sold listings)
const EBAY_FINDING_API = 'https://svcs.ebay.com/services/search/FindingService/v1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { item } = body;

    if (!item || item.trim() === '') {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    // Build eBay Finding API request for completed items
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findCompletedItems',
      'SERVICE-VERSION': '1.13.0',
      'SECURITY-APPNAME': process.env.EBAY_APP_ID || 'YourAppName-FlipDar-PRD-12345678-12345678',
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': '',
      'keywords': item,
      'itemFilter(0).name': 'ListingType',
      'itemFilter(0).value(0)': 'AuctionWithBIN',
      'itemFilter(0).value(1)': 'FixedPrice',
      'itemFilter(0).value(2)': 'StoreInventory',
      'itemFilter(1).name': 'SoldItemsOnly',
      'itemFilter(1).value': 'true',
      'sortOrder': 'EndTimeSoonest',
      'paginationInput.entriesPerPage': '50'
    });

    const response = await fetch(`${EBAY_FINDING_API}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`eBay API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse eBay response
    const searchResult = data.findCompletedItemsResponse?.[0]?.searchResult?.[0];
    
    if (!searchResult || !searchResult.item) {
      return NextResponse.json({
        item: item,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgDuration: 0,
        count: 0,
        message: 'No completed listings found for this item'
      });
    }

    const items = Array.isArray(searchResult.item) ? searchResult.item : [searchResult.item];
    const totalCount = parseInt(searchResult['@count'] || '0');

    if (items.length === 0) {
      return NextResponse.json({
        item: item,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgDuration: 0,
        count: 0,
        message: 'No completed listings found for this item'
      });
    }

    // Calculate statistics from sold items
    const prices = items
      .map(item => parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.['__value__'] || '0'))
      .filter(price => price > 0);

    const durations = items
      .map(item => {
        const startTime = new Date(item.listingInfo?.[0]?.startTime?.[0] || '');
        const endTime = new Date(item.listingInfo?.[0]?.endTime?.[0] || '');
        return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24); // days
      })
      .filter(duration => duration > 0 && duration < 365); // Filter out invalid durations

    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

    return NextResponse.json({
      item: item,
      avgPrice: Math.round(avgPrice * 100) / 100,
      minPrice: Math.round(minPrice * 100) / 100,
      maxPrice: Math.round(maxPrice * 100) / 100,
      avgDuration: Math.round(avgDuration * 100) / 100,
      count: totalCount,
      message: `Found ${totalCount} completed listings`
    });

  } catch (error: any) {
    console.error('eBay API error:', error);
    return NextResponse.json({ 
      error: 'Unable to fetch eBay data. Please try again later.',
      details: error.message
    }, { status: 503 });
  }
}
