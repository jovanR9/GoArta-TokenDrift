const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableColumns() {
  try {
    // Let's try to insert with a proper structure to understand what columns exist
    console.log("Checking table columns by attempting different insert operations...");
    
    // First, try with just the basic fields we know should exist
    const minimalUser = {
      email: 'test@example.com'
    };
    
    const { data: minimalData, error: minimalError } = await supabase
      .from('users')
      .insert([minimalUser]);
      
    if (minimalError) {
      console.log('Minimal insert failed:', minimalError.message);
    } else {
      console.log('Minimal insert succeeded');
    }
    
    // Try with common user fields
    const commonUser = {
      email: 'test2@example.com',
      fname: 'Test',
      lname: 'User'
    };
    
    const { data: commonData, error: commonError } = await supabase
      .from('users')
      .insert([commonUser]);
      
    if (commonError) {
      console.log('Common insert failed:', commonError.message);
    } else {
      console.log('Common insert succeeded');
    }
    
    // Clean up any test data
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .or('email.eq.test@example.com,email.eq.test2@example.com');
      
    if (deleteError) {
      console.error('Error cleaning up test data:', deleteError.message);
    } else {
      console.log('Test data cleaned up successfully');
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

checkTableColumns();