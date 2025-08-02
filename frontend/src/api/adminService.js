import { API_BASE_URL } from '../utils/constants';
const tokenHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const getUsers = async (search = '', page = 1) => {
  const res = await fetch(`${API_BASE_URL}/admin/users?search=${search}&page=${page}`, { headers: tokenHeader() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const updateUserRole = async (userId, role) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...tokenHeader() },
    body: JSON.stringify({ role })
  });
  if (!res.ok) throw new Error('Failed to update role');
  return res.json();
};
