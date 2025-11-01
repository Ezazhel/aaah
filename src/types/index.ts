import type {
  GameCategory,
  MemberRole,
  EventType,
  EventStatus,
} from "@/constants/labels";

export type Game = {
  id: number; // Changed from string to number
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
  status?: "prototype" | "playtesting" | "published"; // development status
  // Auth & ownership fields
  createdBy?: string; // User ID who created the game (UUID)
  isDraft?: boolean; // Whether the game is a draft (not published yet)
  updatedAt?: string; // Last update date
};

// Game creation/update input type (for forms)
export type GameInput = Omit<Game, 'id' | 'authors' | 'createdBy' | 'updatedAt'> & {
  authorIds: number[]; // Changed from string[] to number[]
};

export type Author = {
  id: number; // Changed from string to number
  name: string;
  region: string; // required
  role: MemberRole;
  // --- Additional optional fields for detail page ---
  bio?: string; // Short bio
  fullBio?: string; // Full bio for detail page
  photoUrl?: string; // profile photo URL
  joinedDate?: string; // ISO date string when joined association
  specialties?: string[]; // array of game types/mechanics they specialize in
  website?: string; // personal website URL
  // Social links (flattened structure to match backend)
  twitterUrl?: string;
  instagramUrl?: string;
  bggUrl?: string; // BoardGameGeek profile
  achievements?: string[]; // awards, published games, etc.
  contactEmail?: string; // email for contact
};

export type Article = {
  id: number; // Changed from string to number
  title: string;
  content: string;
  authorId: number; // Changed from string to number
  publishedAt: string;
  imageUrl: string;
  // Additional fields to match backend
  excerpt?: string; // Summary/extract of the article
  tags?: string[]; // Article tags/categories
  status?: 'draft' | 'published'; // Publication status
};

export type Event = {
  id: number; // Renamed from eventId and changed from string to number
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
  attendees?: Author[]; // Changed from string[] to Author[] to match backend
  registrationUrl?: string;
  isFree: boolean;
  price?: number;
  tags?: string[];
  status: EventStatus;
};

// ============= User & Auth Types =============

export type User = {
  id: string; // Remains string (UUID from backend)
  email: string;
  name: string;
  role: 'member' | 'admin';
  authorId?: number; // Changed from string to number
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterData = {
  email: string;
  password: string;
  name: string;
  invitationToken: string;
};

export type ResetPasswordRequest = {
  email: string;
};

export type ResetPasswordConfirm = {
  token: string;
  newPassword: string;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

// ============= Invitation Types =============

export type Invitation = {
  id: string;
  email: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  createdBy: string; // User ID who created the invitation
};
