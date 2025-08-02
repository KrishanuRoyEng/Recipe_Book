// src/api/tagService.js
import { API_BASE_URL } from '../utils/constants';

const tokenHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getTags = async () => {
  const res = await fetch(`${API_BASE_URL}/tags`);
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
};

export const createTag = async (tag) => {
  const res = await fetch(`${API_BASE_URL}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...tokenHeader() },
    body: JSON.stringify(tag),
  });
  if (!res.ok) throw new Error('Failed to create tag');
  return res.json();
};
