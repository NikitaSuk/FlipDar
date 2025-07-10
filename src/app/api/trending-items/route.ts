import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabaseUrl = 'http://127.0.0.1:54321/functions/v1/trending-items';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseAnonKey) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    console.log('Fetching from:', supabaseUrl);
    const response = await fetch(supabaseUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Edge Function response not ok:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return NextResponse.json({ error: `Edge Function error: ${response.status}` }, { status: 500 });
    }
    
    const data = await response.json();
    console.log('Successfully fetched trending items:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 