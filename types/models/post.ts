import type { User } from './user';

/**
 * Post translation
 * Represents a translated version of a post
 */
export interface PostTranslation {
  languageCode: string;
  languageName: string;
  content: string;
}

/**
 * Post model
 * Represents a micro-post in the system
 */
export interface Post {
  id: string;
  content: string;
  createdAt: string;
  user: Pick<User, 'id' | 'name' | 'email'>;
  translations?: PostTranslation[];
}
