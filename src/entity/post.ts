import type { SanityDocument } from '@sanity/client';

export interface Post extends SanityDocument {
  publishedAt: string;
  author: string;
  title: string;
}
