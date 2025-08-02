// src/api/mealService.js
import { API_BASE_URL } from '../utils/constants';

const tokenHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMealPlans = async () => {
  const res = await fetch(`${API_BASE_URL}/mealplans`, { headers: tokenHeader() });
  if (!res.ok) throw new Error('Failed to fetch meal plans');
  return res.json();
};

export const addMealPlan = async (weekStart, meals) => {
  const res = await fetch(`${API_BASE_URL}/mealplans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...tokenHeader() },
    body: JSON.stringify({ weekStart, meals }),
  });
  if (!res.ok) throw new Error('Failed to add meal plan');
  return res.json();
};

export const generateShoppingList = async () => {
  const res = await fetch(`${API_BASE_URL}/shoppinglists`, { headers: tokenHeader() });
  if (!res.ok) throw new Error('Failed to generate shopping list');
  return res.json();
};

export const deleteMeal = async (planId, mealId) => {
  const res = await fetch(`${API_BASE_URL}/mealplans/${planId}/meals/${mealId}`, {
    method: 'DELETE',
    headers: tokenHeader(),
  });
  if (!res.ok) throw new Error('Failed to delete meal');
  return res.json();
};