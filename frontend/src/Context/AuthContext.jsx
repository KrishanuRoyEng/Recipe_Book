import { createContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser } from '../api/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    getMe()  // API call to /auth/me
      .then(setUser)
      .catch(() => setUser(null));
  }
  }, []);

  const login = async (email, password) => {
  const data = await loginUser(email, password);
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  if (data.user) {
    setUser(data.user); // If login returns user data
  } else {
    const me = await getMe(); // Fetch user if login didn't return it
    setUser(me);
  }
  };
  
  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    localStorage.setItem('token', data.token);

    if (data.user) {
      setUser(data.user);
    } else {
      const me = await getMe();
      setUser(me);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
