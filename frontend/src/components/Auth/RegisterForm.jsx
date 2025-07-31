import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../Auth/AuthForm.css';

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Register</h2>
      <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
      <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
      <button type="submit">Register</button>
    </form>
  );
}
