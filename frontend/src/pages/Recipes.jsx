import { useEffect, useState } from 'react';
import { getRecipes } from '../api/recipeService';
import FabButton from '../components/Common/FabButton';
import RecipeCard from '../components/Recipes/RecipeCard';
import './styles/Recipes.css';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getRecipes(search).then(data => setRecipes(data.results || data));
  }, [search]);

  return (
    <div className="recipes-container">
      <h1>Recipes</h1>
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      <div className="recipes-grid">
        {recipes.map(r => (
          <RecipeCard key={r._id} recipe={r} />
        ))}
      </div>
      <FabButton to="/recipes/new" tooltip="Create New Recipe" />
    </div>
  );
}
