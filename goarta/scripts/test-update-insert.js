const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdateAndInsert() {
  try {
    console.log("Testing update and insert functionality...");
    
    // Sign up a new test user
    const email = `updateinsert${Date.now()}@gmail.com`;
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
    
    if (authData.user?.id) {
      // Try to update (this should fail if no record exists)
      console.log("Trying to update non-existent record...");
      const updates = {
        fname: "Update Insert Test First Name",
        lname: "Update Insert Test Last Name",
        short_bio: "This is a test bio"
      };
      
      const { error: updateError } = await supabase
        .from("users")
        .update(updates)
        .eq("auth_id", authData.user.id);
        
      if (updateError) {
        console.log("Update failed as expected:", updateError.message);
        
        // Now try to insert
        console.log("Trying to insert new record...");
        const insertData = {
          auth_id: authData.user.id,
          email: email,
          ...updates
        };
        
        const { error: insertError } = await supabase
          .from("users")
          .insert(insertData);
          
        if (insertError) {
          console.error("Insert failed:", insertError.message);
        } else {
          console.log("Insert successful");
        }
      } else {
        console.log("Update successful");
      }
      
      // Fetch the data to verify
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
      
      // Clean up
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

testUpdateAndInsert();