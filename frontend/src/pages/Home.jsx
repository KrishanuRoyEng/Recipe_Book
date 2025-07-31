import './styles/Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <h1>Welcome to Smart Recipe Planner</h1>
      <p>Discover new recipes, plan meals, and create shopping lists easily.</p>
      <Link to="/recipes" className="cta-btn">Explore Recipes</Link>
    </div>
  );
}
