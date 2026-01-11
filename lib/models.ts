// ============================================
// Models Layer - Question 1.3
// ============================================
// This file contains all model operations following the MVC pattern.
// The Model is responsible for data access and business logic.

import prisma from './prisma';
import bcrypt from 'bcryptjs';

// ============================================
// User Model Operations
// ============================================

/**
 * Login with email and password
 * Validates credentials and returns user if successful
 */
export async function loginUser(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null; // User not found
  }

  // Compare password with hashed password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return null; // Invalid password
  }

  // Return user without password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Get a user by their identifier
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

/**
 * Get all users in the system
 */
export async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users;
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  password: string,
  name: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return user;
}

// ============================================
// Post Model Operations
// ============================================

/**
 * Get all of a specific user's posts
 */
export async function getUserPosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      translations: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts;
}

/**
 * Get a specific user's first post
 */
export async function getUserFirstPost(userId: string) {
  const firstPost = await prisma.post.findFirst({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc', // First post is the oldest
    },
  });

  return firstPost;
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      translations: true,
    },
  });

  return post;
}

/**
 * Create a new post
 */
export async function createPost(userId: string, content: string) {
  const post = await prisma.post.create({
    data: {
      content,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return post;
}

/**
 * Delete a specific user's post
 * Returns null if post doesn't exist or doesn't belong to user
 */
export async function deleteUserPost(postId: string, userId: string) {
  // First check if the post exists and belongs to the user
  const existingPost = await prisma.post.findFirst({
    where: {
      id: postId,
      userId: userId, // Ensure user owns the post
    },
  });

  if (!existingPost) {
    return null; // Post not found or doesn't belong to user
  }

  // Delete the post
  const deletedPost = await prisma.post.delete({
    where: { id: postId },
  });

  return deletedPost;
}

/**
 * Get all posts from all users
 */
export async function getAllPosts() {
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      translations: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts;
}

// ============================================
// Translation Model Operations (Question 1.4)
// ============================================

/**
 * Add a translation to a post
 */
export async function addPostTranslation(
  postId: string,
  languageCode: string,
  languageName: string,
  content: string
) {
  const translation = await prisma.postTranslation.upsert({
    where: {
      postId_languageCode: {
        postId,
        languageCode,
      },
    },
    update: {
      content,
    },
    create: {
      postId,
      languageCode,
      languageName,
      content,
    },
  });

  return translation;
}

/**
 * Get post translation by language
 */
export async function getPostTranslation(postId: string, languageCode: string) {
  const translation = await prisma.postTranslation.findUnique({
    where: {
      postId_languageCode: {
        postId,
        languageCode,
      },
    },
  });

  return translation;
}

// ============================================
// SMS Import Model Operations (Question 1.4)
// ============================================

/**
 * Import SMS messages
 */
export async function importSMSMessages(
  userId: string,
  messages: Array<{
    phoneNumber: string;
    messageText: string;
    sentAt: Date;
    isFromUser: boolean;
  }>
) {
  const imports = await prisma.sMSImport.createMany({
    data: messages.map((msg) => ({
      userId,
      phoneNumber: msg.phoneNumber,
      messageText: msg.messageText,
      sentAt: msg.sentAt,
      isFromUser: msg.isFromUser,
    })),
  });

  return imports;
}

/**
 * Get user's imported SMS messages
 */
export async function getUserSMSImports(userId: string) {
  const imports = await prisma.sMSImport.findMany({
    where: { userId },
    orderBy: { sentAt: 'desc' },
  });

  return imports;
}

/**
 * Convert SMS to post
 */
export async function convertSMSToPost(smsId: string, userId: string) {
  const sms = await prisma.sMSImport.findFirst({
    where: { id: smsId, userId },
  });

  if (!sms) return null;

  const post = await createPost(userId, sms.messageText);

  await prisma.sMSImport.update({
    where: { id: smsId },
    data: { convertedToPostId: post.id },
  });

  return post;
}
