import { request } from './api';
export const getRecipes = (q = '') => request(`/recipes?search=${q}`);
export const getRecipe = (id) => request(`/recipes/${id}`);
export const addComment = (id, text) => request(`/recipes/${id}/comments`, {
  method: 'POST',
  body: JSON.stringify({ text })
});
export const rateRecipe = (id, rating) => request(`/recipes/${id}/rate`, {
  method: 'POST',
  body: JSON.stringify({ rating })
});
export const createRecipe = (data) => request('/recipes', { method: 'POST', body: JSON.stringify(data) });
export const updateRecipe = (id, data) => request(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
