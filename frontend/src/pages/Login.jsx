import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoginForm from '../components/Auth/LoginForm';
import './styles/AuthPages.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      navigate(location.state?.from || '/'); // Redirect back or to home
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
