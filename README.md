# RecipeHub V2

**RecipeHub V2** is a polished, secure, database-driven MERN stack application for discovering, sharing, and managing global recipes. It features role-based authentication, an AI-powered recipe chatbot, Cloudinary image storage, admin approval workflows, and email notifications.

---

## Features

### Public Browsing
- Browse 26+ global recipes without creating an account
- Filter by cuisine (Indian, Italian, Chinese, Russian, and more)
- Search recipes by name or country of origin
- View complete recipe details, ingredients, and step-by-step instructions

### User Roles
| Role | Capabilities |
|------|-------------|
| **Visitor** | Browse approved recipes, use AI chatbot |
| **User** | Visitor + registered account |
| **Cook** | User + submit recipes (pending admin review) |
| **Admin** | Full access + approve/reject recipes, view dashboard |

### Cook Features
- Register as a Cook
- Submit recipes with images
- Images automatically uploaded to Cloudinary
- Submitted recipes enter a pending review queue
- Admin receives an email notification for each submission

### Admin Dashboard
- View statistics: total, approved, pending, rejected recipes
- Inspect full recipe details before approving
- Approve recipes (instantly public) or reject with a reason
- Permanently delete recipes (auto-cleans Cloudinary image)
- Access via `/admin` route (admin-only)

### AI Recipe Chatbot
- Floating chat button (bottom-right corner)
- Powered by Groq's Llama-3 model
- **Database-aware:** Only recommends recipes that actually exist in RecipeHub
- Clickable recipe recommendations open the full recipe modal
- Input validation and rate limiting to prevent abuse

### Security
- JWT authentication with role-based authorization
- bcryptjs password hashing
- Admin accounts only creatable via secure seed script
- Rate limiting on all API routes
- Helmet HTTP security headers
- CORS restricted to configured frontend URL
- All secrets in environment variables (never committed)

---

## Technology Stack

### Frontend
- **React 19** — UI library
- **Vite** — Build tool and dev server
- **Tailwind CSS v4** — Utility-first styling
- **Lucide React** — Icon library
- **React Router DOM v7** — Client-side routing
- **Axios** — HTTP client
- **React Toastify** — Notification toasts

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB Atlas** — Cloud database (`recipehub` database)
- **Mongoose** — MongoDB ODM
- **JWT** — Authentication tokens
- **bcryptjs** — Password hashing
- **Helmet** — HTTP security headers
- **express-rate-limit** — Rate limiting

### Cloud Services
- **Cloudinary** — Recipe image storage
- **Nodemailer + SMTP** — Admin email notifications
- **Groq API** — AI recipe recommendations (Llama-3)

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
# Copy examples
cp server/.env.example server/.env
cp client/.env.example client/.env
```
Fill in your MongoDB, Cloudinary, Groq, and SMTP credentials. See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

### 3. Seed Admin User
```bash
cd server
npm run seed:admin
```

### 4. Migrate Recipes to Database
```bash
cd server
npm run seed:recipes
```

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
PORT, NODE_ENV, MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD,
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM,
GROQ_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
CLIENT_URL, SERVER_URL
```

### Frontend (`client/.env`)
```
VITE_API_URL
```

See `server/.env.example` and `client/.env.example` for full templates.

---

## Deployment

1. **Backend:** Deploy to Render, Railway, or Fly.io — set start command to `npm start`
2. **Frontend:** Deploy to Vercel or Netlify — set `VITE_API_URL` to your backend URL
3. **Database:** MongoDB Atlas free tier (already configured)
4. **Images:** Cloudinary free tier (already configured)

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#12-production-build) for full deployment instructions.

---

*Designed & Developed with ♥ by Jat Sandeep*
