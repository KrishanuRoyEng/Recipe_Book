import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthForm from '../components/Auth/AuthForm';
import './styles/AuthPages.css';

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  const handleSubmit = async (form) => {
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
        navigate('/dashboard');
      } else {
        await login(form.email, form.password);
        navigate(location.state?.from || '/');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image"></div>
      <div className="auth-card">
        <AuthForm mode={isRegister ? 'register' : 'login'} onSubmit={handleSubmit} />
        <div className="links">
          {isRegister ? (
            <p>Already have an account? <a href="/login">Login</a></p>
          ) : (
            <p>Don’t have an account? <a href="/register">Sign up</a></p>
          )}
        </div>
      </div>
    </div>
  );
}
