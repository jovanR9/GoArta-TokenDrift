import { NextResponse } from 'next/server';

export type EventSummary = {
  id: number;
  title: string;
  category: string;
  start_time: string;
  venue_name: string;
};

export type EventDetail = EventSummary & {
  description: string;
  end_time: string;
  ticket_price: number;
  booking_url: string | null;
};

const EVENTS: EventDetail[] = [
  {
    id: 501,
    title: 'Sao Joao Festival',
    description: 'The feast of St. John the Baptist... ',
    category: 'Traditional Festival',
    start_time: '2026-06-24T10:00:00Z',
    end_time: '2026-06-24T18:00:00Z',
    venue_name: 'Various locations in North Goa',
    ticket_price: 0.0,
    booking_url: null,
  },
  {
    id: 502,
    title: 'Goa Food & Culture Fair',
    description: 'A celebration of Goan cuisine and arts with live performances.',
    category: 'Cultural Fair',
    start_time: '2026-07-10T12:00:00Z',
    end_time: '2026-07-10T20:00:00Z',
    venue_name: 'Panaji Riverfront',
    ticket_price: 10.0,
    booking_url: 'https://tickets.example.com/event/502',
  },
];

function toSummary(event: EventDetail): EventSummary {
  const { id, title, category, start_time, venue_name } = event;
  return { id, title, category, start_time, venue_name };
}

export async function handleGetEvents(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const categoryParam = url.searchParams.get('category');

  let results = EVENTS;
  if (categoryParam && categoryParam.trim().length > 0) {
    const needle = categoryParam.trim().toLowerCase();
    results = EVENTS.filter((e) => e.category.toLowerCase() === needle);
  }

  return NextResponse.json(results.map(toSummary), { status: 200 });
}

export async function handleGetEventById(idParam: string): Promise<Response> {
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
  }

  const found = EVENTS.find((e) => e.id === id);
  if (!found) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
  }

  return NextResponse.json(found, { status: 200 });
}
