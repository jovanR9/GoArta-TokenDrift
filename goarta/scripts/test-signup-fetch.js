const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignupAndFetch() {
  try {
    console.log("Testing signup and profile fetch...");
    
    // Sign up a new test user
    const email = `test${Date.now()}@gmail.com`;
    const password = "testpassword123";
    const fname = "Test";
    const lname = "User";
    const phnumber = "1234567890";
    
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
    
    // Insert user data into users table
    if (authData.user?.id) {
      console.log("Inserting user data into users table...");
      
      const { error: insertError } = await supabase.from("users").insert({
        auth_id: authData.user.id,
        email,
        fname,
        lname,
        phnumber,
      });
      
      if (insertError) {
        console.error("Insert error:", insertError.message);
      } else {
        console.log("User data inserted successfully");
      }
      
      // Now try to fetch the user data
      console.log("Fetching user data...");
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
      
      // Try to update the user data
      console.log("Updating user data...");
      const updates = {
        fname: "Updated First Name",
        lname: "Updated Last Name",
        short_bio: "This is a test bio"
      };
      
      const { error: updateError } = await supabase
        .from("users")
        .update(updates)
        .eq("auth_id", authData.user.id);
        
      if (updateError) {
        console.error("Update error:", updateError.message);
      } else {
        console.log("User data updated successfully");
      }
      
      // Fetch updated data
      console.log("Fetching updated user data...");
      const { data: updatedUserData, error: fetchUpdatedError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", authData.user.id)
        .maybeSingle();
        
      if (fetchUpdatedError) {
        console.error("Fetch updated error:", fetchUpdatedError.message);
      } else {
        console.log("Fetched updated user data:", updatedUserData);
      }
      
      // Clean up - delete the test user
      console.log("Cleaning up test user...");
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

testSignupAndFetch();