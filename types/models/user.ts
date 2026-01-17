/**
 * User model
 * Represents a user in the system
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
}
