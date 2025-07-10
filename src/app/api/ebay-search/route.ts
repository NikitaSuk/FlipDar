import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabaseUrl = 'http://127.0.0.1:54321/functions/v1/ebay-search';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const body = await req.json();
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
