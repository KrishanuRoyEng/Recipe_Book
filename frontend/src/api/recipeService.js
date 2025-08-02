import { request } from './api';
import { API_BASE_URL } from '../utils/constants';

export const getRecipes = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.tags?.length) filters.tags.forEach(tag => params.append('tags[]', tag));

  return await request(`/recipes?${params.toString()}`, { method: 'GET' });
};

export const getRecipe = (id) => request(`/recipes/${id}`);

export const rateRecipe = (id, rating) => request(`/recipes/${id}/rate`, {
  method: 'POST',
  body: JSON.stringify({ rating })
});
export const createRecipe = async (data, isFormData = false) => {
  const res = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
    body: data,
  });
  if (!res.ok) throw new Error('Failed to create recipe');
  return res.json();
};

export const updateRecipe = async (id, data, isFormData = false) => {
  const options = {
    method: 'PUT',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? data : JSON.stringify(data),
  };
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) throw new Error('Failed to update recipe');
  return res.json();
};

export const deleteRecipe = async (id) => {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  console.log("DELETE response status:", res.status);
  const data = await res.json();
  console.log("DELETE response status:", res.status);
  if (!res.ok) throw new Error(data.message || 'Failed to delete recipe');
  return data;
};

export const getMyRecipes = async () => {
  const res = await fetch(`${API_BASE_URL}/recipes/my`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error('Failed to fetch your recipes');
  return res.json();
};

export const searchRecipes = async (query = '', tags = [], difficulty = '') => {
  const params = new URLSearchParams();
  if (query) params.append('search', query);
  if (tags.length) params.append('tags', tags.join(','));
  if (difficulty) params.append('difficulty', difficulty);

  const res = await fetch(`${API_BASE_URL}/recipes?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to search recipes');

  const data = await res.json();
  // 👇 THIS ensures we always return an array
  return Array.isArray(data.results) ? data.results : [];
};