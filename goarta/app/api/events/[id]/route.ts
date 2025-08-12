import { NextApiRequest, NextApiResponse } from 'next'

// mock data
const events = [
  {
    id: 501,
    title: 'Sao Joao Festival',
    description: 'The feast of St. John the Baptist...',
    category: 'Traditional Festival',
    start_time: '2026-06-24T10:00:00Z',
    end_time: '2026-06-24T18:00:00Z',
    venue_name: 'Various locations in North Goa',
    ticket_price: 0.00,
    booking_url: null
  },
  {
    id: 502,
    title: 'Goa Carnival',
    description: 'Annual carnival with parades and music...',
    category: 'Cultural Festival',
    start_time: '2026-02-10T15:00:00Z',
    end_time: '2026-02-10T23:00:00Z',
    venue_name: 'Panaji, Goa',
    ticket_price: 100.00,
    booking_url: 'https://goacarnival.com/book'
  }
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query
    const event = events.find(e => e.id === Number(id))

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' })
    }

    return res.status(200).json(event)
  } else {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
