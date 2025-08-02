import { useState } from 'react';
import './Styles/MealPlannerPopup.css';

export default function QuickMealPlannerPopup({ onClose, onSave, initialValues }) {
  const [day, setDay] = useState(initialValues?.day || 'Monday');
  const [mealType, setMealType] = useState(initialValues?.mealType || 'Lunch');

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Plan This Meal</h2>

        <label>Day:</label>
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

        <button 
          className="search-btn" 
          onClick={() => onSave({ day, mealType })}
        >
          Save
        </button>
      </div>
    </div>
  );
}
