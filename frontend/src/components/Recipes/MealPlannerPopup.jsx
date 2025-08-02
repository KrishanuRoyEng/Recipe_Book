import { useState } from 'react';
import { searchRecipes } from '../../api/recipeService';
import './Styles/MealPlannerPopup.css';

export default function MealPlannerPopup({ onClose, onAdd }) {
  const [query, setQuery] = useState('');
  const [day, setDay] = useState('Monday');
  const [mealType, setMealType] = useState('Lunch');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const recipes = await searchRecipes(query);
    setResults(recipes);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Add Meal Plan</h2>

        <label>Select Day:</label>
        <select value={day} onChange={e => setDay(e.target.value)}>
          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <label>Meal Type:</label>
        <select value={mealType} onChange={e => setMealType(e.target.value)}>
          {['Breakfast', 'Lunch', 'Dinner'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <label>Search Recipe:</label>
        <input
          type="text"
          placeholder="Type to search recipes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>

        <div className="results">
          {results.length > 0 ? results.map(r => (
            <div key={r._id} className="search-result" onClick={() => onAdd({ ...r, day, mealType })}>
              <img src={r.image || '/placeholder.jpg'} alt={r.title} />
              <p>{r.title}</p>
            </div>
          )) : <p>No results found.</p>}
        </div>
      </div>
    </div>
  );
}
