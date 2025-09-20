const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableStructure() {
  try {
    // Get table structure
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error accessing users table:', error.message);
      return;
    }

    console.log('Sample row from users table:', data);
    
    // Try to get column information
    console.log('Checking if fname and lname columns exist...');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

checkTableStructure();