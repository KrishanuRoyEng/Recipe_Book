require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const MealPlan = require('../models/MealPlan');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear old data
        await User.deleteMany();
        await Recipe.deleteMany();
        await MealPlan.deleteMany();

        // Create users
        const users = await User.insertMany([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: await bcrypt.hash('password123', 10)
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: await bcrypt.hash('password123', 10)
            }
        ]);

        // Create recipes
        const recipes = await Recipe.insertMany([
            {
                title: 'Paneer Tikka',
                ingredients: [
                    { name: 'Paneer', quantity: '200g' },
                    { name: 'Yogurt', quantity: '100g' }
                ],
                steps: ['Marinate paneer', 'Grill until golden'],
                prepTime: 30,
                difficulty: 'Medium',
                createdBy: users[0]._id
            },
            {
                title: 'Pasta Primavera',
                ingredients: [
                    { name: 'Pasta', quantity: '250g' },
                    { name: 'Vegetables', quantity: '150g' }
                ],
                steps: ['Boil pasta', 'Saute veggies', 'Mix together'],
                prepTime: 25,
                difficulty: 'Easy',
                createdBy: users[1]._id
            }
        ]);

        // Create a meal plan
        await MealPlan.create({
            weekStart: new Date(),
            user: users[0]._id,
            meals: [
                { day: 'Monday', mealType: 'Lunch', recipe: recipes[0]._id },
                { day: 'Tuesday', mealType: 'Dinner', recipe: recipes[1]._id }
            ]
        });

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
