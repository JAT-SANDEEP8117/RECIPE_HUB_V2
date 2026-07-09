# RecipeHub V2

**RecipeHub V2** is a polished, full-stack MERN application for discovering, sharing, and managing global recipes. It features a floating glassmorphism navbar, dark navy/orange design, role-based authentication, AI-powered recipe chatbot, advanced filtering, newsletter subscriptions, admin contributor stats, Cloudinary image storage, and email notifications.

---

## Features

### Public Browsing
- Browse **30+ global recipes** from MongoDB without an account
- Filter by cuisine (Indian, Italian, Chinese, Russian, Others)
- **Advanced filter panel** — Meal Type, Dietary (Veg/Non-Veg), Difficulty, Prep Time
- Search recipes by name, country, ingredient, or meal type
- Homepage shows **12 recipes** by default with a "View All" expansion
- View full recipe details, structured ingredients with quantities, and step-by-step instructions

### Cursor Glow & Animations
- Hero section has a **cursor-following radial glow** effect
- Floating glassmorphism navbar with animated profile dropdown
- Chatbot opens/closes with smooth CSS transform animations
- Recipe cards have hover scale + border glow transitions

### AI Recipe Chatbot
- Floating 🤖 button (bottom-right), auto-closes on scroll
- Powered by **Groq Llama-3.3-70b** model
- **Database-aware:** Only recommends recipes that actually exist in RecipeHub
- Auto-growing textarea input (Shift+Enter for newlines, Enter to send)
- Clickable recipe recommendations open the full recipe modal

### Newsletter
- Footer subscription form wired to `/api/newsletter/subscribe`
- Subscribers stored in MongoDB with duplicate-email prevention
- Welcome email sent on subscription via SMTP
- New recipe broadcast email sent to all subscribers when admin approves a recipe

### User Roles
| Role | Capabilities |
|------|-------------|
| **Visitor** | Browse approved recipes, use AI chatbot, subscribe to newsletter |
| **User** | Visitor + registered account |
| **Cook** | User + submit recipes (pending admin review) |
| **Admin** | Full access + approve/reject/delete recipes, view dashboard + contributor stats |

### Cook Features
- Submit recipes with structured ingredients (name + quantity per row)
- Recipe type classification: Breakfast / Lunch / Dinner / Snack / Dessert
- Prep time, difficulty, and servings metadata
- Images uploaded automatically to Cloudinary
- Admin receives email notification per submission

### Admin Dashboard
- Stats: total, pending, approved, rejected recipes + contributor count
- **Pending / Approved / Rejected** tabs for recipe review
- **Cooks/Contributors tab** — Name | Email | Role | Recipe Count | Joined | Latest Recipe
- Inspect full recipe details, ingredients, steps, submitter info
- Approve (instantly public), reject with reason, or permanently delete
- Delete auto-cleans Cloudinary image

### Security
- JWT authentication with role-based authorization middleware
- bcryptjs password hashing (salt rounds = 10)
- Admin accounts only via secure seed script (not via API)
- Rate limiting: 300 req/15min general, 30 req/15min auth, 50 req/15min chatbot
- Helmet HTTP security headers, CORS restricted to configured frontend URL

---

## Technology Stack

### Frontend
- **React 19** — UI library
- **Vite** — Build tool and dev server
- **Tailwind CSS v4** — Utility-first styling (dark navy/orange theme)
- **Lucide React** — Icon library
- **React Router DOM v7** — Client-side routing
- **Axios** — HTTP client with Authorization interceptor
- **React Toastify** — Notification toasts

### Backend
- **Node.js + Express.js** — Runtime and web framework
- **MongoDB Atlas** — Cloud database (`recipehub` database)
- **Mongoose** — MongoDB ODM
- **JWT** — Authentication tokens (30d expiry)
- **bcryptjs** — Password hashing
- **Helmet + express-rate-limit** — Security hardening

### Cloud Services
- **Cloudinary** — Recipe image storage with public_id rollback on failure
- **Nodemailer + SMTP** — Admin notifications + newsletter emails
- **Groq API** — AI recipe recommendations (Llama-3.3-70b-versatile)

---

## Quick Start

### 1. Install Dependencies
```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

### 2. Configure Environment Variables
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
Fill in your MongoDB, Cloudinary, Groq, and SMTP credentials. See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

### 3. Seed Admin User
```bash
cd server
npm run seed:admin
```

### 4. Seed Recipes to Database
```bash
cd server
npm run seed:recipes
```
This seeds all 30 recipes (26 original + 4 new diverse dishes) to MongoDB with Cloudinary image upload. Safe to rerun — fully idempotent.

### 5. Start the Application
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Documentation

| File | Contents |
|------|----------|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Complete setup instructions for all services |
| [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) | Technical architecture and API reference |

---

## Environment Variables

### Backend (`server/.env`)
```
PORT, NODE_ENV, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN,
ADMIN_EMAIL, ADMIN_PASSWORD,
SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM,
GROQ_API_KEY,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
CLIENT_URL, SERVER_URL
```

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

See `server/.env.example` and `client/.env.example` for full templates.

---

## Deployment

1. **Backend:** Deploy to Render, Railway, or Fly.io — set start command to `npm start`
2. **Frontend:** Deploy to Vercel or Netlify — set `VITE_API_URL` to your backend URL
3. **Database:** MongoDB Atlas free tier
4. **Images:** Cloudinary free tier

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for full deployment instructions.

---

*Designed & Developed with ♥ by Jat Sandeep*
