import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Test database connection
    const { data: tables, error: tablesError } = await supabase
      .from('search_history')
      .select('count(*)')
      .limit(1);
    
    if (tablesError) {
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: tablesError.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection working',
      tables: tables
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      error: 'Database test failed', 
      details: error.message 
    }, { status: 500 });
  }
} 