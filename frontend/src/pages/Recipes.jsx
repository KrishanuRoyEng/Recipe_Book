import { useEffect, useState, useCallback } from 'react';
import { getRecipes } from '../api/recipeService';
import FabButton from '../components/Common/FabButton';
import RecipeCard from '../components/Recipes/RecipeCard';
import TagSelector from '../components/Recipes/TagSelector';
import './styles/Recipes.css';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFilteredRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecipes({
        search,
        difficulty,
        tags: selectedTags,
      });
      setRecipes(data.results || data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedTags, difficulty]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchFilteredRecipes();
    }, 300);
    return () => clearTimeout(delay);
  }, [fetchFilteredRecipes]);

  return (
    <div className="recipes-container">
      <h1 className="page-title">Explore Delicious Recipes</h1>

      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="filter-bar">
        <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} />
        <select
          className="difficulty-dropdown"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="no-recipes-text">No recipes found. Try other filters.</p>
      ) : (
        <div className="recipes-grid">
          {recipes.map((r, index) => (
            <div
              key={r._id}
              className="recipe-card-wrapper"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RecipeCard recipe={r} />
            </div>
          ))}
        </div>
      )}

      <FabButton to="/recipes/new" tooltip="Create New Recipe" />
    </div>
  );
}
