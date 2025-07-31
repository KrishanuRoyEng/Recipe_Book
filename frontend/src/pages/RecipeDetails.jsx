import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipe, addComment, rateRecipe } from '../api/recipeService';
import {useNavigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './styles/RecipeDetails.css';

export default function RecipeDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    getRecipe(id)
      .then(setRecipe)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleAddComment = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/recipes/${id}` } });
      return;
    }
    try {
      const comment = await addComment(id, newComment);
      setRecipe(prev => ({ ...prev, comments: [...prev.comments, comment] }));
      setNewComment('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRating = async (value) => {
    if (!user) {
      navigate('/login', { state: { from: `/recipes/${id}` } });
      return;
    }
    try {
      const { average } = await rateRecipe(id, value);
      setUserRating(value);
      alert(`New average rating: ${average.toFixed(1)}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="recipe-details">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!recipe ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>{recipe.title}</h1>
          <img src={recipe.image || '/placeholder.jpg'} alt={recipe.title} />
          <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
          <p><strong>Prep Time:</strong> {recipe.prepTime} mins</p>

          <h3>Ingredients</h3>
          <ul>
            {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ing, idx) => (
                <li key={idx}>
                  {ing.name} {ing.quantity && ` - ${ing.quantity}`}
                </li>
              ))
            ) : (
              <li>No ingredients listed.</li>
            )}
          </ul>

          <h3>Steps</h3>
          <ol>
            {Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
              recipe.steps.map((step, idx) => <li key={idx}>{String(step)}</li>)
            ) : (
              <li>No steps provided.</li>
            )}
          </ol>

          <h3>Rate this recipe:</h3>
          {[1,2,3,4,5].map(num => (
            <button 
              key={num} 
              onClick={() => handleRating(num)} 
              style={{ fontWeight: num === userRating ? 'bold' : 'normal' }}
            >
              {num}★
            </button>
          ))}

          <h3>Comments</h3>
          <ul>
            {recipe.comments?.map((c, idx) => (
              <li key={idx}>
                <strong>{typeof c.user === 'object' ? c.user.name : 'Anonymous'}:</strong> {c.text}
              </li>
            ))}
          </ul>
          <div>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder={user ? 'Write a comment...' : 'Login to comment'}
            />
            <button onClick={handleAddComment}>
              {user ? 'Add Comment' : 'Login to Comment'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
