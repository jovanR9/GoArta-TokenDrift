import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data: events, error } = await supabase
    .from('new_events')
    .select('*');

  if (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform the data to match the expected structure
  const transformedEvents = events.map(event => ({
    ...event,
    // Map Supabase fields to expected fields if needed
    places: event.venue_name || event.places || '',
    date: event.date_range || event.start_time || event.date || '',
    image: event.image_url || event.image || ''
  }));

  return NextResponse.json(transformedEvents);
}