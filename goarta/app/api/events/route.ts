import { NextResponse } from 'next/server';

const eventCards = [
  {
    id: 1,
    title: "Goa Carnival Parade",
    date: "February 22-25, 2025",
    places: "Panjim • Margao • Vasco • Mapusa",
    description: "A four-day spectacle of music, dance, and vibrant floats, celebrating Goa's Portuguese heritage and festive spirit.",
    image: "https://blog.lemontreehotels.com/wp-content/uploads/2025/02/goa-carnival.jpg",
    alt: "Goa Carnival Parade with colorful floats, masks, and vibrant celebrations"
  },
  {
    id: 2,
    title: "Shigmo Festival",
    date: "March 15-20, 2025",
    places: "Panjim • Old Goa • Ponda",
    description: "Traditional spring festival featuring folk dances, colorful processions, and ancient rituals celebrating the harvest season.",
    image: "https://incrediblegoa.org/wp-content/uploads/2023/03/Shigmo-Festival.jpeg",
    alt: "Shigmo Festival with traditional folk dances and spring celebrations"
  },
  {
    id: 3,
    title: "Goa Food & Wine Festival",
    date: "April 10-15, 2025",
    places: "Panjim • Calangute • Margao",
    description: "Culinary extravaganza showcasing Goan delicacies, international cuisines, and the finest wines from around the world.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    alt: "Goa Food Festival with delicious cuisines and wine tasting"
  },
  {
    id: 4,
    title: "Monsoon Music Festival",
    date: "July 5-10, 2025",
    places: "Panjim • Vagator • Anjuna",
    description: "Rain-soaked melodies featuring local bands, international artists, and the magical atmosphere of Goa's monsoon season.",
    image: "https://www.tourmyindia.com/states/goa/image/festivals-in-goa.webp",
    alt: "Monsoon Music Festival with live performances and rain atmosphere"
  },
  {
    id: 5,
    title: "Sunburn Festival",
    date: "December 28-31, 2025",
    places: "Vagator, Goa",
    description: "Asia's largest music festival, featuring top international DJs and a massive stage setup.",
    image: "https://assets-in.bmscdn.com/nmcms/media-base-summer-fest-by-sunburn-bengaluru-2025-3-29-t-6-47-45.jpeg",
    alt: "Sunburn Festival with large crowd and stage lights"
  },
  {
    id: 6,
    title: "Goa Arts and Literature Festival",
    date: "January 15-18, 2026",
    places: "Panjim, Goa",
    description: "A celebration of literature, art, and culture with renowned authors, artists, and performers.",
    image: "https://avidlearning.in/uploads/events/C349CF09-BCDC-4CD0-95D4-A9E6B767ED91.jpg",
    alt: "People attending a literature festival" 
  },
  {
    id: 7,
    title: "Grape Escapade",
    date: "February 1-4, 2026",
    places: "Panjim, Goa",
    description: "India's largest wine festival, showcasing a variety of wines, gourmet food, and live entertainment.",
    image: "https://www.bestgoadeals.com/goatourism/wp-content/uploads/2017/05/Goa-Tourism.jpg",
    alt: "Wine glasses and bottles at a festival"
  }
];

export async function GET() {
  return NextResponse.json(eventCards);
}