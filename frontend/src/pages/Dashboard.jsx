import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useShoppingList } from '../hooks/useShoppingList';
import FabButton from '../components/Common/FabButton';
import MealPlannerPopup from '../components/Recipes/MealPlannerPopup';
import UserRoleManagerPopup from '../components/Auth/userRoleManagerPopup';
import { getMyRecipes } from '../api/recipeService';
import { getMealPlans, addMealPlan, deleteMeal } from '../api/mealService';
import { getTags, createTag } from '../api/tagService';
import './styles/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  // My Recipes
  const [recipes, setRecipes] = useState([]);

  // Meal Planner
  const [mealPlans, setMealPlans] = useState([]);
  const [showPlannerPopup, setShowPlannerPopup] = useState(false);

  // Shopping List
  const { showSidebar, shoppingList, openShoppingSidebar, closeShoppingSidebar, refreshShoppingList } = useShoppingList();

  // Admin Tag Manager
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: '', color: '#000000' });

  // Admin Role Manager
  const [showUserManager, setShowUserManager] = useState(false);

  // Fetch data on load
  useEffect(() => {
    getMyRecipes().then(setRecipes).catch(console.error);
    getMealPlans().then(setMealPlans).catch(console.error);
    if (user?.role === 'admin') getTags().then(setTags).catch(console.error);
  }, [user]);

  // Add meal plan
  const handleAddMeal = async (recipe) => {
    const weekStart = new Date(); // or pick the start of the week
    const meal = {
      day: recipe.day,
      mealType: "Lunch", // or allow user to select
      recipe: recipe._id
    };

    await addMealPlan(weekStart, [meal]);
    setShowPlannerPopup(false);
    const updated = await getMealPlans();
    setMealPlans(updated);

    //If sidebar is open, list is refreshed
    await refreshShoppingList();
  };

  // Delete meal plan
  const handleDeleteMeal = async (planId, mealId) => {
    const updatedPlan = await deleteMeal(planId, mealId);
    setMealPlans(prev => 
      prev.map(plan => plan._id === updatedPlan._id ? updatedPlan : plan)
    );

    //If sidebar is open, list is refreshed
    await refreshShoppingList();
  };

  // Shopping list
  const handleGenerateList = async () => {
    await openShoppingSidebar();
  };

  // Add new tag
  const handleAddTag = async () => {
    const created = await createTag(newTag);
    setTags([...tags, created]);
    setNewTag({ name: '', color: '#000000' });
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name || "Guest"}!</h1>

      {/* MY RECIPES */}
      <section className="my-recipes">
        <h2>Your Recipes</h2>
        <div className="recipes-scroll">
          {recipes.length ? (
            recipes.map((r) => (
              <Link
                to={`/recipes/${r._id}`}
                key={r._id}
                className="recipe-card"
              >
                <img src={r.image || "/placeholder.jpg"} alt={r.title} />
                <p>{r.title}</p>
              </Link>
            ))
          ) : (
            <p>No recipes yet. Create one!</p>
          )}
        </div>
        <FabButton to="/recipes/new" tooltip="Create New Recipe" />
      </section>

      {/* ROLE MANAGER */}
      {user?.role === "admin" && (
        <button
          className="manage-users-btn"
          onClick={() => setShowUserManager(true)}
        >
          Manage Users
        </button>
      )}
      {showUserManager && (
        <UserRoleManagerPopup onClose={() => setShowUserManager(false)} />
      )}

      {/* MEAL PLANNER */}
      <section className="meal-planner">
        <h2>Meal Planner (Weekly)</h2>
        <button className="add-btn" onClick={() => setShowPlannerPopup(true)}>
          + Add Meal
        </button>
        <div className="meal-week-grid">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <div key={day} className="day-column">
              <h3>{day}</h3>
              {mealPlans
                .flatMap((plan) =>
                  plan.meals.map((meal) => ({ ...meal, planId: plan._id }))
                )
                .filter((meal) => meal.day === day)
                .map((meal) => (
                  <div key={meal._id} className="meal-card">
                    <p>
                      {meal.mealType}: {meal.recipe?.title || "Untitled"}
                    </p>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteMeal(meal.planId, meal._id)}
                    >
                      X
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </section>

      {/* SHOPPING LIST */}
      <section className="shopping-section">
        <button className="shopping-btn" onClick={handleGenerateList}>
          🛒 View Shopping List
        </button>
      </section>

      {showSidebar && (
        <div className="shopping-sidebar">
          <div className="shopping-header">
            <h3>Shopping List</h3>
            <button className="close-btn" onClick={closeShoppingSidebar}>
              X
            </button>
          </div>
          <ul className="shopping-list">
            {shoppingList.map((item, idx) => (
              <li key={idx} className="shopping-item">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">{item.totalQuantity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ADMIN TAG MANAGER */}
      {user?.role === "admin" && (
        <section className="tag-manager">
          <h2>Manage Tags</h2>
          <div className="tag-list">
            {tags.map((tag) => (
              <div
                key={tag._id}
                className="tag-item"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Tag name"
            value={newTag.name}
            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
          />
          <input
            type="color"
            value={newTag.color}
            onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
          />
          <button onClick={handleAddTag}>Add Tag</button>
        </section>
      )}

      {/* POPUPS */}
      {showPlannerPopup && (
        <MealPlannerPopup
          onClose={() => setShowPlannerPopup(false)}
          onAdd={handleAddMeal}
        />
      )}
    </div>
  );
}
