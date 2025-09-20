const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWithProperUUID() {
  try {
    console.log("Testing with proper UUID format...");
    
    // Generate a proper UUID
    const userId = uuidv4();
    const email = `uuidtest${Date.now()}@gmail.com`;
    
    console.log("Creating test record with UUID:", userId);
    
    // Try to directly insert a record with proper UUID
    const testData = {
      auth_id: userId,
      email: email,
      fname: "UUID Test First Name",
      lname: "UUID Test Last Name",
      short_bio: "This is a UUID test bio"
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert([testData]);
      
    if (insertError) {
      console.error("Insert failed:", insertError.message);
      console.error("Error code:", insertError.code);
      // Try a different approach if insert fails
      console.log("Trying update approach...");
      
      const { error: updateError } = await supabase
        .from("users")
        .update(testData)
        .eq("auth_id", userId);
        
      if (updateError) {
        console.error("Update also failed:", updateError.message);
      } else {
        console.log("Update successful");
      }
    } else {
      console.log("Insert successful:", insertData);
    }
    
    // Try to fetch the data
    console.log("Fetching data...");
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

testWithProperUUID();