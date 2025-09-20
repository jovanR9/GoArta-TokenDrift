const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserProfileSystem() {
  try {
    console.log("Testing user profile system...");
    
    // Test with your existing user
    const userId = "2ce97143-9806-425e-a492-572fd3382976";
    const email = "tyronesilva5613@gmail.com";
    
    console.log("Testing with existing user ID:", userId);
    
    // Try to fetch the user profile
    console.log("Fetching user profile...");
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", userId)
      .maybeSingle();
      
    if (fetchError) {
      console.error("Fetch error:", fetchError.message);
    } else {
      console.log("Fetched user data:", userData);
    }
    
    // Try to update the user profile
    console.log("Updating user profile...");
    const updates = {
      fname: "Tyrone",
      lname: "Silva",
      short_bio: "Testing the profile system"
    };
    
    const { error: updateError } = await supabase
      .from("users")
      .update(updates)
      .eq("auth_id", userId);
      
    if (updateError) {
      console.error("Update error:", updateError.message);
    } else {
      console.log("User profile updated successfully");
    }
    
    // Fetch updated data
    console.log("Fetching updated user profile...");
    const { data: updatedUserData, error: fetchUpdatedError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", userId)
      .maybeSingle();
      
    if (fetchUpdatedError) {
      console.error("Fetch updated error:", fetchUpdatedError.message);
    } else {
      console.log("Fetched updated user data:", updatedUserData);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testUserProfileSystem();