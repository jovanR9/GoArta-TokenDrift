const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkExistingUsers() {
  try {
    console.log("Checking for existing users in the database...");
    
    // Try to get a count of users
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Count error:', countError.message);
    } else {
      console.log('Total users in database:', count);
    }
    
    // Try to get a few users (without sensitive data)
    const { data, error } = await supabase
      .from('users')
      .select('auth_id, email, fname, lname')
      .limit(5);
      
    if (error) {
      console.error('Error fetching users:', error.message);
      return;
    }
    
    console.log('Sample users:', data);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

checkExistingUsers();