'use client';

import React from 'react';
import { UserCard } from './UserCard';
import type { User } from '@/types';

interface UserListProps {
  users: User[];
  emptyMessage?: string;
  currentUserId?: string;
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
}

export function UserList({
  users,
  emptyMessage = 'No users found.',
  currentUserId,
  onFollowChange,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-text-tertiary text-6xl mb-4'>👥</div>
        <p className='text-text-secondary'>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          currentUserId={currentUserId}
          onFollowChange={onFollowChange}
        />
      ))}
    </div>
  );
}
