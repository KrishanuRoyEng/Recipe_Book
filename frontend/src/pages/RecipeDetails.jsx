import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipe, rateRecipe, updateRecipe, deleteRecipe } from "../api/recipeService";
import { getMealPlans, addMealPlan } from "../api/mealService";
import { getComments, addComment, updateComment, deleteComment } from "../api/commentService";
import { useShoppingList } from "../context/ShoppingListContext";
import QuickMealPlannerPopup from "../components/recipes/QuickMealPlannerPopup";
import useAuth from "../hooks/useAuth";
import TagSelector from "../components/Recipes/TagSelector";
import "./styles/RecipeDetails.css";

export default function RecipeDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const { openShoppingSidebar } = useShoppingList();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [showQuickPopup, setShowQuickPopup] = useState(false);
  const [addedToPlan, setAddedToPlan] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editableRecipe, setEditableRecipe] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [showDanger, setShowDanger] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canEdit =
    user &&
    recipe &&
    (user.role === "admin" ||
      (recipe.author && user._id === recipe.author._id?.toString()));

  useEffect(() => {
    getRecipe(id)
      .then(setRecipe)
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    const checkIfPlanned = async () => {
      try {
        const plans = await getMealPlans();
        const isPlanned = plans.some((plan) =>
          plan.meals.some((meal) => meal.recipe?._id === id)
        );
        setAddedToPlan(isPlanned);
      } catch (err) {
        console.error("Error checking meal plans:", err);
      }
    };
    checkIfPlanned();
  }, [id]);

  const loadComments = useCallback(async () => {
    const data = await getComments(id, page);
    setComments(data.results);
    setTotalPages(data.pages);
  }, [id, page]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleAddComment = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/recipes/${id}` } });
      return;
    }
    const comment = await addComment(id, newComment);
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleEditComment = async (commentId) => {
    const updated = await updateComment(id, commentId, editText);
    setComments((prev) => prev.map((c) => (c._id === commentId ? updated : c)));
    setEditingCommentId(null);
    setEditText("");
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(id, commentId);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  const handleRating = async (value) => {
    if (!user) {
      navigate("/login", { state: { from: `/recipes/${id}` } });
      return;
    }
    try {
      const { average } = await rateRecipe(id, value);
      setUserRating(value);
      setRecipe(prev => ({ ...prev, averageRating: average }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditToggle = () => {
    setEditableRecipe({
      ...recipe,
      tags: recipe.tags?.map(t => t._id || t) || [],
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
    });
    setIsEditing(true);
  };
  const handleImageChange = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, and PNG images are allowed.");
      return;
    }
    setNewImage(file);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewImage(null);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Always send required fields with correct format
      formData.append("title", editableRecipe.title || "");
      formData.append("description", editableRecipe.description || "");
      formData.append("prepTime", editableRecipe.prepTime || "");
      formData.append("difficulty", editableRecipe.difficulty || "");

      // Convert tags to an array of IDs
      formData.append(
        "tags",
        JSON.stringify(
          editableRecipe.tags.map((t) => (typeof t === "object" ? t._id : t))
        )
      );

      // Ingredients & steps as JSON
      formData.append("ingredients", JSON.stringify(editableRecipe.ingredients || []));
      formData.append("steps", JSON.stringify(editableRecipe.steps || []));

      // Add new image if selected
      if (newImage) {
        formData.append("image", newImage);
      }

      // Send to API
      const updated = await updateRecipe(id, formData, true);
      setRecipe(updated);
      setIsEditing(false);
      setNewImage(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteRecipe(id);
      alert(res.message || "Recipe deleted successfully");
      setShowConfirm(false); // Close modal
      navigate("/recipes");
    } catch (err) {
      alert(err.message);
    }
  };

  // Ingredient & step handlers
  const updateIngredient = (index, key, value) => {
    const updatedIngredients = [...editableRecipe.ingredients];
    updatedIngredients[index][key] = value;
    setEditableRecipe({ ...editableRecipe, ingredients: updatedIngredients });
  };
  const addIngredient = () => {
    setEditableRecipe({
      ...editableRecipe,
      ingredients: [...editableRecipe.ingredients, { name: "", quantity: "" }],
    });
  };
  const updateStep = (index, value) => {
    const updatedSteps = [...editableRecipe.steps];
    updatedSteps[index] = value;
    setEditableRecipe({ ...editableRecipe, steps: updatedSteps });
  };
  const addStep = () => {
    setEditableRecipe({
      ...editableRecipe,
      steps: [...editableRecipe.steps, ""],
    });
  };

  return (
    <div className="recipe-details">
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!recipe ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="recipe-header">
            {isEditing ? (
              <input
                type="text"
                value={editableRecipe.title}
                onChange={(e) =>
                  setEditableRecipe({
                    ...editableRecipe,
                    title: e.target.value,
                  })
                }
              />
            ) : (
              <h1>{recipe.title}</h1>
            )}

            {canEdit && !isEditing && (
              <div className="recipe-actions">
                <button className="edit-btn" onClick={handleEditToggle}>
                  ✏️
                </button>
              </div>
            )}
          </div>
          {isEditing ? (
            <form
              className="recipe-edit-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <h2>Edit Recipe</h2>

              {/* Title */}
              <label>Title</label>
              <input
                type="text"
                value={editableRecipe.title}
                onChange={(e) =>
                  setEditableRecipe({
                    ...editableRecipe,
                    title: e.target.value,
                  })
                }
                required
              />

              {/* Description */}
              <label>Description</label>
              <textarea
                value={editableRecipe.description}
                onChange={(e) =>
                  setEditableRecipe({
                    ...editableRecipe,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the recipe..."
              />

              {/* Prep Time */}
              <label>Prep Time (mins)</label>
              <input
                type="number"
                value={editableRecipe.prepTime || ""}
                onChange={(e) =>
                  setEditableRecipe({
                    ...editableRecipe,
                    prepTime: e.target.value,
                  })
                }
                min="1"
              />

              {/* Difficulty */}
              <label>Difficulty</label>
              <select
                value={editableRecipe.difficulty}
                onChange={(e) =>
                  setEditableRecipe({
                    ...editableRecipe,
                    difficulty: e.target.value,
                  })
                }
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              {/* Tags */}
              <label>Tags</label>
              <TagSelector
                selectedTags={editableRecipe.tags.map((t) => t._id || t)}
                onChange={(tags) =>
                  setEditableRecipe({ ...editableRecipe, tags })
                }
              />

              {/* Ingredients */}
              <h3>Ingredients</h3>
              {editableRecipe.ingredients.map((ing, idx) => (
                <div key={idx} className="form-ingredient">
                  <input
                    type="text"
                    placeholder="Name"
                    value={ing.name}
                    onChange={(e) =>
                      updateIngredient(idx, "name", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Quantity"
                    value={ing.quantity}
                    onChange={(e) =>
                      updateIngredient(idx, "quantity", e.target.value)
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                className="small-btn"
                onClick={addIngredient}
              >
                + Add Ingredient
              </button>

              {/* Steps */}
              <h3>Steps</h3>
              {editableRecipe.steps.map((step, idx) => (
                <textarea
                  key={idx}
                  placeholder={`Step ${idx + 1}`}
                  value={step}
                  onChange={(e) => updateStep(idx, e.target.value)}
                />
              ))}
              <button type="button" className="small-btn" onClick={addStep}>
                + Add Step
              </button>

              {/* Image */}
              <h3>Recipe Image</h3>
              <input
                type="file"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />

              {/* Save & Cancel */}
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  💾 Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <img
                src={recipe.image || "/placeholder.jpg"}
                alt={recipe.title}
              />
              <p>
                <strong>Cuisine:</strong> {recipe.cuisine}
              </p>
              <div className="tags">
                {recipe.tags?.map((tag) => (
                  <span
                    key={tag._id}
                    className="tag"
                    style={{
                      backgroundColor: tag.color || "#eee",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      marginRight: "6px",
                      fontSize: "0.9em",
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <p>
                <strong>Prep Time:</strong> {recipe.prepTime} mins
              </p>
              <p>
                <strong>Difficulty:</strong>{" "}
                {recipe.difficulty || "Not specified"}
              </p>
              <p className="recipe-description">
                <h3>Description:</h3>
                {recipe.description || "No description provided."}
              </p>
              <h3>Ingredients</h3>
              <ul>
                {Array.isArray(recipe.ingredients) &&
                recipe.ingredients.length > 0 ? (
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
                  recipe.steps.map((step, idx) => (
                    <li key={idx}>{String(step)}</li>
                  ))
                ) : (
                  <li>No steps provided.</li>
                )}
              </ol>
            </>
          )}

          <h3>Rate this recipe:</h3>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`star ${num <= userRating ? "selected" : ""}`}
                onClick={() => handleRating(num)}
              >
                ★
              </span>
            ))}
          </div>
          <p className="average-rating">
            Average rating:{" "}
            {recipe.averageRating?.toFixed(1) || "No ratings yet"}
          </p>

          <h3>Meal Planning</h3>
          <button
            onClick={() =>
              setShowQuickPopup({ day: "Monday", mealType: "Lunch" })
            }
            className={`plan-btn ${addedToPlan ? "planned" : ""}`}
          >
            {addedToPlan ? "Planned — Edit?" : "Add to Meal Plan"}
          </button>

          {showQuickPopup && (
            <QuickMealPlannerPopup
              initialValues={showQuickPopup}
              onClose={() => setShowQuickPopup(false)}
              onSave={async ({ day, mealType }) => {
                await addMealPlan(new Date(), [
                  { day, mealType, recipe: recipe._id },
                ]);
                setAddedToPlan(true);
                setShowQuickPopup(false);
                await openShoppingSidebar();
              }}
            />
          )}

          <h3>Comments</h3>
          <ul>
            {comments.map((c) => (
              <li key={c._id}>
                <strong>{c.user?.name || "Anonymous"}:</strong>
                {editingCommentId === c._id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={() => handleEditComment(c._id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingCommentId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {c.text}
                    {user &&
                      (user._id === c.user?._id || user.role === "admin") && (
                        <>
                          <br />
                          <button
                            id="edit-comment-button"
                            onClick={() => {
                              setEditingCommentId(c._id);
                              setEditText(c.text);
                            }}
                          >
                            🖋️
                          </button>
                          <button
                            id="delete-comment-button"
                            onClick={() => handleDeleteComment(c._id)}
                          >
                            🗑️
                          </button>
                        </>
                      )}
                  </>
                )}
              </li>
            ))}
          </ul>
          {/* Pagination */}
          <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                disabled={page === i + 1}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Write a comment..." : "Login to comment"}
          />
          <button onClick={handleAddComment}>
            {user ? "Add Comment" : "Login to Comment"}
          </button>
          {/* Danger Zone */}
          <div className={`danger-zone ${showDanger ? "open" : ""}`}>
            <button
              className="danger-toggle"
              onClick={() => setShowDanger(!showDanger)}
            >
              {showDanger ? "Hide Danger Zone" : "Show Danger Zone"}
            </button>

            {showDanger && (
              <div className="danger-content">
                <p style={{ color: "#e63946", fontWeight: "bold" }}>
                  Deleting this recipe cannot be undone.
                </p>
                <button
                  className="delete-btn"
                  onClick={() => setShowConfirm(true)}
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          {showConfirm && (
            <div className="modal-overlay">
              <div className="modal">
                <p>
                  Are you sure you want to delete this recipe? This cannot be
                  undone.
                </p>
                <div className="modal-actions">
                  <button onClick={handleConfirmDelete}>Delete</button>
                  <button onClick={() => setShowConfirm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
