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
    console.log("Testing direct insert...");
    
    // Test with your existing user
    const userId = "2ce97143-9806-425e-a492-572fd3382976";
    const email = "tyronesilva5613@gmail.com";
    
    console.log("Inserting user profile for ID:", userId);
    
    // Try to insert a user profile
    const profileData = {
      auth_id: userId,
      email: email,
      fname: "Tyrone",
      lname: "Silva",
      short_bio: "Direct insert test"
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert([profileData])
      .select();
      
    if (insertError) {
      console.error("Insert error:", insertError.message);
      console.error("Error code:", insertError.code);
    } else {
      console.log("Insert successful:", insertData);
    }
    
    // Fetch the data
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
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testDirectInsert();