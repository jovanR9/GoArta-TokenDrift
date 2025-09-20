const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCompleteFlow() {
  try {
    console.log("Testing complete user flow...");
    
    // Sign up a new test user
    const email = `flowtest${Date.now()}@gmail.com`;
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
    
    // Simulate login (which should trigger profile creation)
    if (authData.user?.id) {
      console.log("Simulating login and profile fetch...");
      
      // Try to fetch the user data (this should create a profile if none exists)
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
      
      // If no data exists, try to create it
      if (!userData) {
        console.log("No profile found, creating basic profile...");
        const { data: insertedData, error: insertError } = await supabase.from("users").insert({
          auth_id: authData.user.id,
          email: email,
        }).select();
        
        if (insertError) {
          console.error("Insert error:", insertError.message);
        } else {
          console.log("Profile created:", insertedData);
        }
      }
      
      // Try to update the user data
      console.log("Updating user data...");
      const updates = {
        fname: "Flow Test First Name",
        lname: "Flow Test Last Name",
        short_bio: "This is a test bio from the complete flow test"
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

testCompleteFlow();