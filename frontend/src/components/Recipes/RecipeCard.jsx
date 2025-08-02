import { Link } from 'react-router-dom';
import './Styles/RecipeCard.css';

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe._id}`} className="recipe-card">
      <div className="image-container">
        <img src={recipe.image || '/placeholder.jpg'} alt={recipe.title} />
        <div className="tags-overlay">
          {recipe.tags?.slice(0, 3).map(tag => (
            <span
              key={tag._id}
              className="tag-pill"
              style={{ backgroundColor: tag.color || '#666' }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        {recipe.difficulty && (
          <span className={`difficulty-badge ${recipe.difficulty.toLowerCase()}`}>
            {recipe.difficulty}
          </span>
        )}
      </div>
      <div className="card-content">
        <h3>{recipe.title}</h3>
      </div>
    </Link>
  );
}

