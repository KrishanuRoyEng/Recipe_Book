import { useState } from 'react';
import { createRecipe, updateRecipe } from '../../api/recipeService';
import { useNavigate } from 'react-router-dom';
import TagSelector from './TagSelector';
import './Styles/RecipeForm.css';

export default function RecipeForm({ existingRecipe }) {
  const [form, setForm] = useState(existingRecipe || {
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '' }],
    steps: [''],
    tags: [],
    difficulty: ''
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, JPEG, and PNG images are allowed.');
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('ingredients', JSON.stringify(form.ingredients));
      formData.append('steps', JSON.stringify(form.steps));
      formData.append('tags', JSON.stringify(form.tags));
      formData.append('difficulty', form.difficulty);
      if (image) formData.append('image', image);

      let saved;
      if (existingRecipe) {
        saved = await updateRecipe(existingRecipe._id, formData, true);
      } else {
        saved = await createRecipe(formData, true);
      }

      navigate(`/recipes/${saved._id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="recipe-form-container">
      <h2>{existingRecipe ? 'Edit Recipe' : 'Create a New Recipe'}</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="Delicious Dish Name"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Describe your recipe..."
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          <textarea
            placeholder="One per line (e.g., Sugar - 2 cups)"
            onChange={e => setForm({...form, ingredients: e.target.value.split('\n').map(line => {
              const [name, quantity] = line.split('-').map(s => s.trim());
              return { name, quantity };
            })})}
          />
        </div>

        <div className="form-group">
          <label>Steps</label>
          <textarea
            placeholder="One step per line"
            onChange={e => setForm({...form, steps: e.target.value.split('\n')})}
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <TagSelector
            selectedTags={form.tags}
            onChange={(newTags) => setForm({ ...form, tags: newTags })}
          />
        </div>

        <div className="form-group">
          <label>Difficulty</label>
          <select
            value={form.difficulty}
            onChange={e => setForm({ ...form, difficulty: e.target.value })}
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="form-group">
          <label>Recipe Image</label>
          <input type="file" onChange={e => handleImageChange(e.target.files[0])} />
        </div>

        <button type="submit" className="submit-btn">
          {existingRecipe ? 'Update Recipe' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
}
