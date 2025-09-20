const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAllUsers() {
  try {
    console.log("Checking all users in the database...");
    
    // Try to fetch all users (limit to 5 for safety)
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .limit(5);
      
    if (error) {
      console.error("Error fetching users:", error.message);
      return;
    }
    
    console.log("All users:", data);
    
    // Check if table is empty
    if (data.length === 0) {
      console.log("Users table is empty");
    } else {
      console.log(`Found ${data.length} users`);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

checkAllUsers();