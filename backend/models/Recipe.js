const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: String, required: true }, // e.g., "200g"
      },
    ],

    steps: [String],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    cuisine: String,
    prepTime: Number,
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    image: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ratings: [{ user: mongoose.Schema.Types.ObjectId, rating: Number }],
    comments: [
      { user: mongoose.Schema.Types.ObjectId, text: String, date: Date },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
