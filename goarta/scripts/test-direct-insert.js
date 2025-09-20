const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDirectInsert() {
  try {
    console.log("Testing direct insert functionality...");
    
    // Sign up a new test user
    const email = `directinsert${Date.now()}@gmail.com`;
    const password = "testpassword123";
    const userId = `test-user-${Date.now()}`;
    
    console.log("Creating test record with user ID:", userId);
    
    // Try to directly insert a record
    const testData = {
      auth_id: userId,
      email: email,
      fname: "Direct Insert Test First Name",
      lname: "Direct Insert Test Last Name",
      short_bio: "This is a direct insert test bio"
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert([testData]);
      
    if (insertError) {
      console.error("Insert failed:", insertError.message);
      console.error("Error code:", insertError.code);
      console.error("Error details:", insertError.details);
    } else {
      console.log("Insert successful:", insertData);
    }
    
    // Try to fetch the data
    console.log("Fetching inserted data...");
    const { data: fetchData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", userId)
      .maybeSingle();
      
    if (fetchError) {
      console.error("Fetch error:", fetchError.message);
    } else {
      console.log("Fetched data:", fetchData);
    }
    
    // Clean up
    console.log("Cleaning up test record...");
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("auth_id", userId);
      
    if (deleteError) {
      console.error("Delete error:", deleteError.message);
    } else {
      console.log("Test record deleted successfully");
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testDirectInsert();