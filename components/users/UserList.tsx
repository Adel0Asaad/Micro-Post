'use client';

import React from 'react';
import { UserCard } from './UserCard';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface UserListProps {
  users: User[];
  emptyMessage?: string;
}

export function UserList({
  users,
  emptyMessage = 'No users found.',
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
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
