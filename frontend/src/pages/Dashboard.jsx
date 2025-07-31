import useAuth from '../hooks/useAuth';
import FabButton from '../components/Common/FabButton';
import './styles/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name || 'Guest'}!</h1>
      <p>Email: {user?.email}</p>
      <div className="dashboard-content">
        <h2>Your Recipes</h2>
        <p>Coming soon: Manage your recipes here.</p>
        <FabButton to="/recipes/new" tooltip="Create New Recipe" />
      </div>
    </div>
  );
}
