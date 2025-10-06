import type {
  GameCategory,
  MemberRole,
  EventType,
  EventStatus,
} from '@/constants/labels';

export type Game = {
  id: string;
  name: string;
  authors: Author[];
  description: string;
  minPlayers: number;
  maxPlayers: number;
  duration: number; // in minutes
  imageUrl: string;
  category: GameCategory;
  mechanics: string[];
  images?: string[]; // array of image URLs for gallery
  rulesUrl?: string; // link to PDF rules
  videoRulesUrl?: string; // link to video rules, e.g., YouTube
  contactEmail?: string; // author's contact email
  fullDescription?: string; // longer description for detail page
  publishedDate?: string; // when the prototype was created
  status?: 'prototype' | 'playtesting' | 'published'; // development status
};

export type Author = {
  id: string;
  name: string;
  region: string; // required
  role: MemberRole;
  // --- Additional optional fields for detail page ---
  bio?: string; // short bio, 1-2 sentences (optional, for compatibility)
  fullBio?: string; // longer biography for detail page
  photoUrl?: string; // profile photo URL
  joinedDate?: string; // ISO date string when joined association
  specialties?: string[]; // array of game types/mechanics they specialize in
  website?: string; // personal website URL
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    bgg?: string; // BoardGameGeek profile
  };
  achievements?: string[]; // awards, published games, etc.
  contactEmail?: string; // email for contact
};

export type Article = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: string;
  imageUrl: string;
};

export type Event = {
  eventId: string;
  name: string;
  startDate: string;
  endDate?: string;
  location: string;
  region: string;
  description: string;
  fullDescription?: string;
  imageUrl?: string;
  type: EventType;
  organizerName?: string;
  attendees?: string[];
  registrationUrl?: string;
  isFree: boolean;
  price?: number;
  tags?: string[];
  status: EventStatus;
};
