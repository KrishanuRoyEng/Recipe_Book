import { useState } from 'react';
import { createRecipe, updateRecipe } from '../../api/recipeService';
import { useNavigate } from 'react-router-dom';

export default function RecipeForm({ existingRecipe }) {
  const [form, setForm] = useState(existingRecipe || { title: '', description: '', ingredients: [], steps: [] });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let saved;
      if (existingRecipe) {
        saved = await updateRecipe(existingRecipe._id, form);
      } else {
        saved = await createRecipe(form);
      }
      navigate(`/recipes/${saved._id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
      {/* For simplicity, single-line inputs for ingredients & steps */}
      <textarea placeholder="Ingredients (name - quantity per line)" 
        onChange={e => setForm({...form, ingredients: e.target.value.split('\n').map(line => {
          const [name, quantity] = line.split('-').map(s => s.trim());
          return { name, quantity };
        })})}
      />
      <textarea placeholder="Steps (one per line)" 
        onChange={e => setForm({...form, steps: e.target.value.split('\n')})}
      />
      <button type="submit">{existingRecipe ? 'Update' : 'Create'} Recipe</button>
    </form>
  );
}
