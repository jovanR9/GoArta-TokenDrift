import { supabaseClient } from "@/app/api/supabaselogin/supabase";

async function testUserData() {
  try {
    // Get the current session
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (session?.user) {
      console.log("Current user ID:", session.user.id);
      console.log("Current user email:", session.user.email);
      
      // Fetch user data from the users table
      const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("auth_id", session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user data:", error.message);
        return;
      }
      
      console.log("User data from database:", data);
    } else {
      console.log("No active session found");
    }
  } catch (error) {
    console.error("Test error:", error);
  }
}

testUserData();