# 🍽️ Recipe Planner

<p align="center"> <a href="https://recipe-book-pzcn-l3vrz7pqe-krishanuroyengs-projects.vercel.app/" target="_blank"> <img src="https://img.shields.io/badge/🚀%20Live%20Demo-Click%20Here-2ea44f?style=for-the-badge&logo=vercel" alt="Live Demo"/> </a> </p> <p align="center"> <img src="https://img.shields.io/badge/Recipe%20Planner-Cook%20•%20Plan%20•%20Share-ff6b35?style=for-the-badge" alt="Recipe Planner"/> </p>

**Recipe Planner** is a full-stack web application that lets you **create, explore, and manage recipes**, plan your weekly meals, generate shopping lists, and more — all in one place.  

---

## 🌟 Features

- **👨‍🍳 Create & Share Recipes**  
  Add custom recipes with images, ingredients, steps, and tags.  

- **🎯 Filter & Search**  
  Search recipes by name, filter by difficulty and tags.

- **📅 Meal Planner**  
  Plan your meals for the week and quickly add recipes.

- **🛒 Shopping List**  
  Generate dynamic shopping lists from your meal plans.

- **⭐ Ratings & Comments**  
  Rate recipes and leave comments for others.

- **🎨 Sleek UI**  
  Modern, responsive design with dark mode-inspired visuals.

- **👑 Role-based Access**  
  Admins can manage tags and user roles.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/)  
- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)  
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)  
- **Image Storage**: [Cloudinary](https://cloudinary.com/)  
- **Authentication**: JWT (JSON Web Token)  

---

## 📸 Preview


![Home Page Preview](./frontend/src/assets/home.jpeg)  

## 📹 DEMO VIDEO
[▶️ Watch Demo](https://youtu.be/JbIop7EctKc)

---

## 📂 Project Structure

```bash
project-root/
├── backend/
│ ├── models/ # Mongoose Schemas
│ ├── routes/ # API routes
│ ├── controllers/ # Route handlers
│ ├── scripts/seed.js # Seeder script
│ └── server.js # Express server
│
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ └── styles/ # Styles
│ └── vite.config.js # Vite config
│
└── start.sh / start.bat # One-click dev starter
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/recipe-planner.git
cd recipe-planner
```

###2. Install dependencies

Backend:
```bash
cd backend
npm install
```
Frontend:
```bash
cd ../frontend
npm install
```
###3. Configure Environment
Create .env files in backend/ and frontend/:

Backend .env
```bash
env

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
PORT=5000
```
Frontend .env
```bash
env

VITE_API_BASE_URL=http://localhost:5000/api
```
###4. Seed Database
```bash
cd backend
node scripts/seed.js
```
###5. Run in Development
Start backend:
```bash

npm run dev
```
Start frontend:
```bash

cd ../frontend
npm run dev
```
###6. One-Click Start (Cross-platform)
Run everything with one command:

On Mac/Linux:
```bash

./start.sh
```
On Windows:
Double-click `start.bat`

🧾 Commands

| Command                    | Description                         |
| -------------------------- | ----------------------------------- |
| `npm run dev`              | Start backend in dev mode (nodemon) |
| `npm run start`            | Start backend in production         |
| `npm run seed`             | Run seeder script                   |
| `npm run dev` (frontend)   | Start Vite dev server               |
| `npm run build` (frontend) | Build frontend for production       |


###🔒 Security & Deployment
Never commit your `.env` files.

For production, use environment variables via your hosting (Render, Heroku, Railway, etc.).

For images, store assets in Cloudinary instead of local storage.

Use a reverse proxy (NGINX) or serve frontend via Express in production.

###🤝 Contributing
1. Fork this repo

2. Create a branch: `git checkout -b feature/your-feature`

3. Commit changes: `git commit -m 'Add feature'`

4. Push to branch: `git push origin feature/your-feature`

5. Open a Pull Request

###📜 License
This project is licensed under the MIT License.

Made with ❤️ by Krishanu Roy

