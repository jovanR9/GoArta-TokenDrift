import { supabaseClient } from "@/app/api/supabaselogin/supabase";

async function checkTableStructure() {
  try {
    // Check if we can access the users table
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Error accessing users table:", error.message);
      return;
    }

    console.log("Users table structure check:", data);
    
    // Check table info
    const { data: tableInfo, error: tableError } = await supabaseClient
      .from("users")
      .select("*, !columns(*)");
      
    if (tableError) {
      console.error("Error getting table info:", tableError.message);
    } else {
      console.log("Table info:", tableInfo);
    }
  } catch (error) {
    console.error("Test error:", error);
  }
}

checkTableStructure();