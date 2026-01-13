import type { Post } from '../models/post';
import type { User } from '../models/user';

/**
 * Posts list response
 */
export interface PostsResponse {
  posts: Post[];
}

/**
 * Single post response
 */
export interface PostResponse {
  post: Post;
}

/**
 * Create post request
 */
export interface CreatePostRequest {
  content: string;
}

/**
 * Users list response
 */
export interface UsersResponse {
  users: User[];
}

/**
 * User posts response
 */
export interface UserPostsResponse {
  user: User;
  posts: Post[];
}
