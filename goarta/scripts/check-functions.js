const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseFunctions() {
  try {
    console.log("Checking for database functions...");
    
    // This is a simplified check - in a real scenario, you might need to query 
    // the PostgreSQL system tables to get function information
    
    // Try to see if there's a function that automatically creates user profiles
    console.log("Checking if user profile is automatically created...");
    
    // Sign up a new test user
    const email = `functiontest${Date.now()}@gmail.com`;
    const password = "testpassword123";
    
    console.log("Signing up user:", email);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (authError) {
      console.error('Signup error:', authError.message);
      return;
    }
    
    console.log('Signup successful, user ID:', authData.user?.id);
    
    // Wait a moment to see if a profile is automatically created
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try to fetch the user data
    console.log("Fetching user data after signup...");
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authData.user.id)
      .maybeSingle();
      
    if (fetchError) {
      console.error("Fetch error:", fetchError.message);
    } else {
      console.log("Fetched user data:", userData);
    }
    
    // Clean up
    if (authData.user?.id) {
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("auth_id", authData.user.id);
        
      if (deleteError) {
        console.error("Delete error:", deleteError.message);
      } else {
        console.log("Test user deleted successfully");
      }
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

checkDatabaseFunctions();