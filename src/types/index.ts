import type {
  GameCategory,
  MemberRole,
  EventType,
  EventStatus,
} from '@/constants/labels';

export type Game = {
  id: string;
  name: string;
  authorIds: string[];
  authorNames: string[];
  description: string;
  minPlayers: number;
  maxPlayers: number;
  duration: number; // in minutes
  imageUrl: string;
  category: GameCategory;
  mechanics: string[];
  categories: string[];
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
  avatarUrl: string;
  region: string;
  bio: string;
  role: MemberRole;
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
