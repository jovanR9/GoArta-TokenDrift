// app/api/payment/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, name, email, contact } = body;

    if (!eventId) {
      return NextResponse.json({ error: "eventId required" }, { status: 400 });
    }

    // Supabase client (server-side, use service role key)
    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // fetch event
    const { data: event, error: fetchErr } = await supabase
      .from("events")
      .select("id, title, ticket_price, description")
      .eq("id", eventId)
      .maybeSingle();

    if (fetchErr || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Get price: prefer numeric column, otherwise parse description
    let rupees: number | null = null;
    if (event.ticket_price !== null && event.ticket_price !== undefined) {
      rupees = Number(event.ticket_price);
    } else if (event.description) {
      const match =
        event.description.match(/₹\s*([\d,]+(?:\.\d+)?)/) ||
        event.description.match(/Rs\.?\s*([\d,]+(?:\.\d+)?)/i) ||
        event.description.match(/([\d,]+(?:\.\d+)?)\s*(?:rupees|INR)/i);
      if (match && match[1]) rupees = Number(match[1].replace(/,/g, ""));
    }

    if (rupees === null || Number.isNaN(rupees)) {
      return NextResponse.json(
        { error: "Price not found in event" },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(rupees * 100); // Razorpay expects paise

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${eventId}_${Date.now()}`,
      notes: {
        eventId: String(event.id),
        eventTitle: event.title ?? "",
        buyerName: name ?? "",
        buyerEmail: email ?? "",
      },
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error("payment route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
