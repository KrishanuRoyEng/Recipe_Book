import { Link } from 'react-router-dom';
import './RecipeCard.css';

export default function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img src={recipe.image || '/placeholder.jpg'} alt={recipe.title} />
      <h3>{recipe.title}</h3>
      <p>{recipe.cuisine}</p>
      <Link to={`/recipes/${recipe._id}`}>View Details</Link>
    </div>
  );
}
