import { API_BASE_URL } from '../utils/constants';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
}
