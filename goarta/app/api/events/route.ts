import { NextApiRequest, NextApiResponse } from 'next';

// Mock data
const events = [
  {
    id: 501,
    title: 'Sao Joao Festival',
    category: 'Traditional Festival',
    start_time: '2026-06-24T10:00:00Z',
    venue_name: 'Various locations in North Goa'
  },
  {
    id: 502,
    title: 'Goa Carnival',
    category: 'Cultural Festival',
    start_time: '2026-02-10T15:00:00Z',
    venue_name: 'Panaji, Goa'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // No filtering — just return all events
    return res.status(200).json(events);
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
