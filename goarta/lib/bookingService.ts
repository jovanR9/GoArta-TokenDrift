import { supabase } from "@/lib/supabaseClient";

// Fetch paid bookings for a user along with event details
export async function getUserBookings(userId: number) {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      status,
      created_at,
      events:id!inner(event_id, name, price, date)
    `)
    .eq("user_id", userId)
    .eq("status", "paid");

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
  return data;
}

// Insert a new booking (status = pending)
export async function createBooking(userId: number, eventId: number, razorpay_order_id: string) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: userId,
      event_id: eventId,
      razorpay_order_id,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    return null;
  }
  return data;
}
