const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserUpdate() {
  try {
    console.log("Testing user update operation...");
    
    // First, check if we can get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError.message);
      return;
    }
    
    if (!session?.user) {
      console.log('No active session. Please log in first.');
      return;
    }
    
    console.log('Current user ID:', session.user.id);
    
    // Try to update the user record
    const updates = {
      fname: 'Updated First Name',
      lname: 'Updated Last Name'
    };
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('auth_id', session.user.id);
      
    if (error) {
      console.error('Update error:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      return;
    }
    
    console.log('Update successful:', data);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testUserUpdate();