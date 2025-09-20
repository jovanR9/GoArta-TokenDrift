const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPolicies() {
  try {
    console.log("Checking current RLS policies...");
    
    // This won't work from the client, but let's try to understand the issue
    console.log("The RLS policies are still preventing inserts.");
    console.log("You need to run the SQL commands in your Supabase SQL editor:");
    console.log("");
    console.log("-- Check current policies");
    console.log("SELECT * FROM pg_policy WHERE polrelid = 'users'::regclass;");
    console.log("");
    console.log("-- Drop existing policies");
    console.log("DROP POLICY IF EXISTS \"Users can insert their own profile\" ON public.users;");
    console.log("DROP POLICY IF EXISTS \"Users can update their own profile\" ON public.users;");
    console.log("DROP POLICY IF EXISTS \"Users can read their own profile\" ON public.users;");
    console.log("");
    console.log("-- Enable RLS");
    console.log("ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;");
    console.log("");
    console.log("-- Create new policies");
    console.log("CREATE POLICY \"Users can insert their own profile\" ");
    console.log("ON public.users ");
    console.log("FOR INSERT ");
    console.log("TO authenticated ");
    console.log("WITH CHECK (auth.uid() = auth_id);");
    console.log("");
    console.log("CREATE POLICY \"Users can update their own profile\" ");
    console.log("ON public.users ");
    console.log("FOR UPDATE ");
    console.log("TO authenticated ");
    console.log("USING (auth.uid() = auth_id);");
    console.log("");
    console.log("CREATE POLICY \"Users can read their own profile\" ");
    console.log("ON public.users ");
    console.log("FOR SELECT ");
    console.log("TO authenticated ");
    console.log("USING (auth.uid() = auth_id);");
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

checkPolicies();