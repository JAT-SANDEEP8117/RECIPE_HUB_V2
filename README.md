# RecipeHub (MERN Edition)

**RecipeHub** is a premium, full-stack recipe discovery and sharing platform. Re-imagined with the MERN stack, it offers a high-performance, responsive experience for food enthusiasts worldwide.

## ✨ Features

- **🌍 Global Discovery:** Explore a curated list of dishes from India, Italy, China, Russia, and more.
- **🔍 Smart Search & Filter:** Instantly find recipes by name, country, or dietary preference (Veg/Non-Veg).
- **📝 Contribution Engine:** Sharpen your culinary influence by adding your own recipes with a rich, multi-step form.
- **🎨 Premium UI:** A modern, dark-themed interface built with Tailwind CSS v4, featuring smooth animations and glassmorphism.
- **🔒 Secure Authentication:** Ready-to-go JWT-based authentication for user profiles.
- **⚡ High Performance:** Powered by Vite and React for lightning-fast navigation.

## 🛠️ Technology Stack

- **Frontend:** React.js, Tailwind CSS v4, Lucide React, React Router.
- **Backend:** Node.js, Express.
- **Database:** MongoDB (Mongoose).
- **Form Handling:** Dynamic state management in React.

## 📂 Project Structure

```text
RecipeHub/
├── client/           # React frontend (Vite)
│   ├── src/
│   │   ├── api/      # Local data and API hooks
│   │   ├── components/# Reusable UI components
│   │   ├── pages/    # Full-page components
│   │   └── App.jsx   # Core routing
├── server/           # Express backend
│   ├── models/       # Mongoose Schemas
│   ├── routes/       # API Router
│   ├── config/       # DB configuration
│   └── index.js      # Server entry point
└── OLD CODE/         # Reference files from the legacy project
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### Setup Instructions

1. **Clone the Repo:**
   ```bash
   git clone <repository-url>
   cd recipe_hub
   ```

2. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Create a .env file with your MONGO_URI
   npm start
   ```

## 📜 License

This project is licensed under the MIT License.

---
Designed & Developed by **Jat Sandeep** with ♥.
