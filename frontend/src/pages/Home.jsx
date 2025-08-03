import { Link } from "react-router-dom";
import "./styles/Home.css";

export default function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="overlay">
          <h1>Welcome to Your Recipe Book</h1>
          <p>Discover, create, and share your favorite recipes. Plan meals and shop with ease!</p>
          <Link to="/recipes" className="cta-btn">Explore Recipes</Link>
        </div>
      </div>
    </div>
  );
}
