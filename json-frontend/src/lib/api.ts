import { User } from '@/types/user';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
} 