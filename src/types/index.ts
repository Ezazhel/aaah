import type {
  GameCategory,
  MemberRole,
  EventType,
  EventStatus,
} from "@/constants/labels";

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
  status?: "prototype" | "playtesting" | "published"; // development status
  // Auth & ownership fields
  createdBy?: string; // User ID who created the game
  isDraft?: boolean; // Whether the game is a draft (not published yet)
  updatedAt?: string; // Last update date
};

// Game creation/update input type (for forms)
export type GameInput = Omit<Game, 'id' | 'authors' | 'createdBy' | 'updatedAt'> & {
  authorIds: string[]; // Array of author IDs instead of full Author objects
};

export type Author = {
  id: string;
  name: string;
  region: string; // required
  role: MemberRole;
  // --- Additional optional fields for detail page ---
  bio?: string; // bio
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

// ============= User & Auth Types =============

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'admin';
  authorId?: string; // Link to Authors table if user is an author
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
