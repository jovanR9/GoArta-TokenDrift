const { createClient } = require('@supabase/supabase-js');

// These should match your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableSchema() {
  try {
    // Since we can't directly query the schema, let's try inserting a test user
    // and see what happens
    console.log("Attempting to insert a test user to understand the schema...");
    
    const testUser = {
      auth_id: 'test-user-id',
      email: 'test@example.com',
      fname: 'Test',
      lname: 'User',
      phnumber: '1234567890',
      countrycode: '+1',
      short_bio: 'Test bio'
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert([testUser]);
      
    if (error) {
      console.error('Error inserting test user:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return;
    }
    
    console.log('Successfully inserted test user:', data);
    
    // Now try to retrieve it
    const { data: retrievedData, error: retrieveError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', 'test-user-id');
      
    if (retrieveError) {
      console.error('Error retrieving test user:', retrieveError.message);
      return;
    }
    
    console.log('Retrieved test user:', retrievedData);
    
    // Clean up
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('auth_id', 'test-user-id');
      
    if (deleteError) {
      console.error('Error deleting test user:', deleteError.message);
    } else {
      console.log('Test user deleted successfully');
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

checkTableSchema();