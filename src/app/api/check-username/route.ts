import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    
    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    
    // Query existing users to check username uniqueness
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error checking username:', error);
      return NextResponse.json({ error: 'Failed to check username' }, { status: 500 });
    }

    const usernameExists = users.users.some(user => 
      user.user_metadata?.username === username.trim().toLowerCase()
    );

    return NextResponse.json({ 
      available: !usernameExists,
      message: usernameExists ? 'Username is already taken' : 'Username is available'
    });

  } catch (error) {
    console.error('Error in check-username route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 