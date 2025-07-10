import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('date', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ transactions: data });
}

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const body = await req.json();
  const { type, item, price, date, platform, condition, notes } = body;
  if (!type || !item || !price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const { data: inserted, error } = await supabase
    .from('transactions')
    .insert({
      user_id: session.user.id,
      type,
      item,
      price,
      date: date ? new Date(date) : new Date(),
      platform,
      condition,
      notes,
    })
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ transaction: inserted?.[0] });
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing transaction id' }, { status: 400 });
  }
  const body = await req.json();
  const { type, item, price, date, platform, condition, notes } = body;
  const { data: updated, error } = await supabase
    .from('transactions')
    .update({ type, item, price, date, platform, condition, notes })
    .eq('id', id)
    .eq('user_id', session.user.id)
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ transaction: updated?.[0] });
}

export async function DELETE(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing transaction id' }, { status: 400 });
  }
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 