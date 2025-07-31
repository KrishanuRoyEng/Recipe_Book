import { request } from './api';
export const loginUser = (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const registerUser = (name, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
export const getMe = () => request('/users/me');
