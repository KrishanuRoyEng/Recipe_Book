import { API_BASE_URL } from '../utils/constants';

const tokenHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const getComments = async (recipeId, page = 1) => {
  const res = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
};

export const addComment = async (recipeId, text) => {
  const res = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments`, {
    method: 'POST',
    headers: tokenHeader(),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
};

export const updateComment = async (recipeId, commentId, text) => {
  const res = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments/${commentId}`, {
    method: 'PUT',
    headers: tokenHeader(),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to update comment');
  return res.json();
};

export const deleteComment = async (recipeId, commentId) => {
  const res = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: tokenHeader(),
  });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
};
