import { NextResponse } from "next/server";
import { supabaseClient } from "@/app/api/supabaselogin/supabase";

export async function GET() {
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
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      return NextResponse.json({ 
        userId: session.user.id,
        userEmail: session.user.email,
        userData: data 
      });
    } else {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}