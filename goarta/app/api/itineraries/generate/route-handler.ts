import { NextResponse } from 'next/server';

export type GenerateItineraryRequest = {
  interests: string[];
  duration_days: number;
  pace: string;
};

export type ItineraryActivity = {
  experience_id: number;
  name: string;
  time_slot: string;
};

export type ItineraryDay = {
  day: number;
  activities: ItineraryActivity[];
};

export type GenerateItineraryResponse = {
  itinerary_id: string;
  days: ItineraryDay[];
};

const ALLOWED_PACES = ['relaxed', 'moderate', 'fast'] as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidRequestBody(body: unknown): body is GenerateItineraryRequest {
  if (typeof body !== 'object' || body === null) return false;
  const candidate = body as Partial<GenerateItineraryRequest>;

  const interestsValid = Array.isArray(candidate.interests) && candidate.interests.every(isNonEmptyString);
  const durationValid = typeof candidate.duration_days === 'number' && Number.isInteger(candidate.duration_days!) && candidate.duration_days! > 0;
  const paceValid = isNonEmptyString(candidate.pace) && ALLOWED_PACES.includes(candidate.pace as (typeof ALLOWED_PACES)[number]);

  return interestsValid && durationValid && paceValid;
}

function generateTimeSlots(numActivities: number): string[] {
  const baseSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];
  const slots: string[] = [];
  for (let i = 0; i < numActivities; i += 1) {
    slots.push(baseSlots[i % baseSlots.length]);
  }
  return slots;
}

function buildActivitiesForInterests(interests: string[], dayIndex: number): ItineraryActivity[] {
  const timeSlots = generateTimeSlots(Math.max(2, Math.min(4, interests.length)));
  const activities: ItineraryActivity[] = [];

  for (let i = 0; i < timeSlots.length; i += 1) {
    const interest = interests[i % interests.length];
    activities.push({
      experience_id: Number(`${dayIndex + 1}${i + 1}${Math.floor(Math.random() * 90 + 10)}`),
      name: `Explore ${interest}`,
      time_slot: timeSlots[i],
    });
  }

  return activities;
}

function buildItinerary(body: GenerateItineraryRequest): GenerateItineraryResponse {
  const days: ItineraryDay[] = [];
  for (let i = 0; i < body.duration_days; i += 1) {
    days.push({
      day: i + 1,
      activities: buildActivitiesForInterests(body.interests, i),
    });
  }

  return {
    itinerary_id: `itin_${Date.now()}`,
    days,
  };
}

export async function handleGenerateItinerary(request: Request): Promise<Response> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 422 });
  }

  if (!isValidRequestBody(json)) {
    return NextResponse.json({ error: 'Invalid preferences provided.' }, { status: 422 });
  }

  const body = json as GenerateItineraryRequest;
  const itinerary = buildItinerary(body);
  return NextResponse.json(itinerary, { status: 200 });
}
