import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get unique items from user's transactions for suggestions
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('item, platform, condition')
      .eq('user_id', user.id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch suggestions' },
        { status: 500 }
      );
    }

    // Extract unique items, platforms, and conditions
    const items = [...new Set(transactions.map(tx => tx.item))];
    const platforms = [...new Set(transactions.map(tx => tx.platform).filter(Boolean))];
    const conditions = [...new Set(transactions.map(tx => tx.condition).filter(Boolean))];

    return NextResponse.json({
      items,
      platforms,
      conditions
    });
  } catch (error) {
    console.error('Error fetching transaction suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
} 