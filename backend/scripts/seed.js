require("dotenv").config();
const mongoose = require("mongoose");

const Tag = require("../models/Tags");
const Recipe = require("../models/Recipe");
const MealPlan = require("../models/MealPlan");

const USER_ID = "688b84e9177d40ca687b5b4b"; // Your user ID

const tagsData = [
  { name: "Italian", color: "#ff5733" },
  { name: "Indian", color: "#ff9933" },
  { name: "Mexican", color: "#e63946" },
  { name: "Vegan", color: "#38a169" },
  { name: "Dessert", color: "#ff69b4" },
  { name: "Quick & Easy", color: "#3182ce" },
  { name: "Breakfast", color: "#f4a261" },
  { name: "Dinner", color: "#6d6875" }
];

const recipesData = (tags) => [
  {
    title: "Spaghetti Carbonara",
    description: "A classic Italian pasta dish with creamy sauce and pancetta.",
    ingredients: [
      { name: "Spaghetti", quantity: "200g" },
      { name: "Eggs", quantity: "2" },
      { name: "Pancetta", quantity: "100g" },
      { name: "Parmesan", quantity: "50g" }
    ],
    steps: ["Boil pasta", "Cook pancetta", "Mix eggs and cheese", "Combine all"],
    tags: [tags.find(t => t.name === "Italian")._id],
    cuisine: "Italian",
    prepTime: 25,
    difficulty: "Medium",
    author: USER_ID,
    image: ""
  },
  {
    title: "Vegan Buddha Bowl",
    description: "Healthy vegan bowl with quinoa, chickpeas, and fresh veggies.",
    ingredients: [
      { name: "Quinoa", quantity: "1 cup" },
      { name: "Chickpeas", quantity: "1 cup" },
      { name: "Avocado", quantity: "1" },
      { name: "Mixed Veggies", quantity: "2 cups" }
    ],
    steps: ["Cook quinoa", "Prepare veggies", "Mix all ingredients in a bowl"],
    tags: [tags.find(t => t.name === "Vegan")._id, tags.find(t => t.name === "Quick & Easy")._id],
    cuisine: "Fusion",
    prepTime: 20,
    difficulty: "Easy",
    author: USER_ID,
    image: ""
  },
  {
    title: "Chocolate Lava Cake",
    description: "Delicious molten chocolate cake for dessert lovers.",
    ingredients: [
      { name: "Dark Chocolate", quantity: "200g" },
      { name: "Butter", quantity: "100g" },
      { name: "Flour", quantity: "50g" },
      { name: "Eggs", quantity: "2" }
    ],
    steps: ["Melt chocolate and butter", "Mix ingredients", "Bake at 200°C for 10 minutes"],
    tags: [tags.find(t => t.name === "Dessert")._id],
    cuisine: "French",
    prepTime: 30,
    difficulty: "Hard",
    author: USER_ID,
    image: ""
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Optional: Clear old data
    await Tag.deleteMany();
    await Recipe.deleteMany();
    await MealPlan.deleteMany();

    // Insert tags
    const tags = await Tag.insertMany(tagsData);
    console.log("Tags seeded");

    // Insert recipes
    const recipes = await Recipe.insertMany(recipesData(tags));
    console.log("Recipes seeded");

    // Insert meal plans
    const weekStart = new Date();
    const mealPlans = [
      {
        user: USER_ID,
        weekStart,
        meals: [
          { day: "Monday", mealType: "Lunch", recipe: recipes[0]._id },
          { day: "Tuesday", mealType: "Dinner", recipe: recipes[1]._id },
          { day: "Friday", mealType: "Dessert", recipe: recipes[2]._id }
        ]
      }
    ];
    await MealPlan.insertMany(mealPlans);
    console.log("Meal plans seeded");

    console.log("Seeding complete!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
