# RecipeHub V2 — Technical Documentation

## System Overview

RecipeHub V2 is a full-stack MERN application for discovering, sharing, and managing global recipes. It features role-based authentication, AI-powered recipe recommendations, Cloudinary image storage, and an admin approval workflow.

---

## Architecture

```
recipe_hub/
├── client/                   # React + Vite frontend
│   ├── public/images/        # Static recipe images (for seeding)
│   └── src/
│       ├── api/              # Axios instance + static recipe data
│       ├── components/       # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── RecipeCard.jsx
│       │   ├── RecipeModal.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── Chatbot.jsx
│       ├── context/          # React Context (AuthContext)
│       ├── pages/            # Full-page route components
│       │   ├── Home.jsx
│       │   ├── About.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── AddRecipe.jsx
│       │   └── AdminDashboard.jsx
│       ├── App.jsx           # Route definitions + ToastContainer
│       ├── main.jsx          # React entry point
│       └── index.css         # Tailwind CSS v4 import
│
└── server/                   # Node.js + Express backend
    ├── config/
    │   ├── db.js             # MongoDB Atlas connection (recipehub DB)
    │   └── multer.js         # Multer disk storage config
    ├── controllers/
    │   ├── authController.js
    │   ├── recipeController.js
    │   └── chatbotController.js
    ├── middleware/
    │   └── authMiddleware.js  # protect + authorize functions
    ├── models/
    │   ├── User.js
    │   └── Recipe.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── recipeRoutes.js
    │   └── chatbotRoutes.js
    ├── scripts/
    │   ├── seedAdmin.js       # Creates admin user from env vars
    │   ├── seedRecipes.js     # Migrates static recipes to MongoDB
    │   └── recipes.json       # Static recipe definitions
    ├── services/
    │   ├── cloudinaryService.js
    │   └── emailService.js
    ├── uploads/               # Temp disk storage (auto-cleaned)
    └── index.js               # Express app entry point
```

---

## Database Architecture

### Connection
- **Atlas Cluster:** Shared cluster (may contain other databases)
- **Database Name:** `recipehub` — enforced via `{ dbName: 'recipehub' }` in `mongoose.connect()`
- **Isolation:** Complete isolation from other databases (e.g. Spend Smart) in the same cluster

### Collections

#### `users`
```
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (bcrypt hashed),
  role: String (enum: ['user', 'cook', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

#### `recipes`
```
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  name: String (required),
  category: String (enum: ['Veg', 'Non-Veg'], required),
  origin: String (required),
  ingredients: [String],
  procedure: [String],
  image: String (Cloudinary secure_url),
  cloudinaryPublicId: String,
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  rejectionReason: String,
  submitterRole: String (enum: ['user', 'cook', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication & Authorization

### JWT Strategy
- Token signed with `process.env.JWT_SECRET`
- Payload: `{ id: user._id }`
- Expiry: 30 days (configurable via `JWT_EXPIRES_IN`)
- Token stored in `localStorage` as `userInfo` JSON

### Roles
| Role | Can Do |
|------|--------|
| `user` | Browse approved recipes, use chatbot |
| `cook` | All user permissions + submit recipes (pending review) |
| `admin` | All permissions + review/approve/reject recipes, delete any recipe |

### Middleware
- `protect` — Verifies Bearer token, attaches `req.user`
- `authorize(...roles)` — Checks `req.user.role` is in allowed list, returns 403 if not

### Security Guarantees
- Public `POST /api/auth/register` ignores `role: 'admin'` — forces to `user` or `cook` only
- Admin accounts can only be created via `npm run seed:admin` (server-side script using env vars)
- All sensitive routes have both `protect` and `authorize` middleware

### Rate Limiting
- General API: 300 requests / 15 minutes per IP
- Auth routes: 30 requests / 15 minutes per IP (brute-force protection)
- Chatbot: 50 requests / 15 minutes per IP

---

## API Routes

### Authentication (`/api/auth`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/register` | Public | Register user or cook (not admin) |
| POST | `/login` | Public | Login any role |

### Recipes (`/api/recipes`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/` | Public | Get all **approved** recipes |
| POST | `/` | Cook, Admin | Submit new recipe (multipart/form-data) |
| GET | `/my-recipes` | Cook, Admin | Get logged-in user's own recipes |
| GET | `/admin/all` | Admin only | Get all recipes with status |
| PATCH | `/:id/review` | Admin only | Approve or reject recipe |
| DELETE | `/:id` | Owner or Admin | Delete recipe + Cloudinary image |

### Chatbot (`/api/chatbot`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/` | Public | Get AI recipe recommendation |

---

## Recipe Submission Workflow

```
Cook submits recipe
        ↓
Multer saves image to uploads/
        ↓
Backend uploads image to Cloudinary
        ↓
   Upload failed?  ───YES──→ Return error (temp file cleaned up)
        ↓ NO
Save recipe to MongoDB (status: 'pending')
        ↓
   DB save failed?  ──YES──→ Delete Cloudinary image, return error
        ↓ NO
Try send email to ADMIN_EMAIL
        ↓
   Email failed?  ───YES──→ Log error, continue (recipe is safe)
        ↓ NO
Return success + recipe to frontend
```

---

## Admin Approval Workflow

```
Admin logs in → redirected to /admin
        ↓
Dashboard shows stats + pending queue
        ↓
Admin clicks pending recipe → inspects details
        ↓
Admin clicks APPROVE
    → recipe.status = 'approved'
    → recipe immediately appears in public browse
        ↓
OR Admin clicks REJECT
    → provides rejection reason
    → recipe.status = 'rejected'
    → recipe hidden from public
```

---

## Cloudinary Architecture

- **Folder:** All recipe images stored in `recipehub/` folder in Cloudinary
- **Upload flow:** Server uploads via `cloudinary.uploader.upload(filePath)` then cleans temp file
- **References stored:** Only `secure_url` (HTTPS URL) and `public_id` in MongoDB
- **Deletion:** When recipe deleted, `cloudinary.uploader.destroy(public_id)` is called
- **Rollback:** If MongoDB save fails after Cloudinary upload, the Cloudinary asset is deleted

---

## Groq AI Chatbot Architecture

```
User types message
        ↓
Frontend sends POST /api/chatbot { message }
        ↓
Backend validates message (max 500 chars)
        ↓
Fetch ALL approved recipes from MongoDB
        ↓
Build system prompt with recipe list as context
        ↓
Call Groq API (llama-3.3-70b-versatile model)
        ↓
Parse Groq response text
        ↓
Scan response for recipe name matches (regex word boundary)
        ↓
Return: { response: string, recommendedRecipes: Recipe[] }
        ↓
Frontend renders response text + clickable recipe buttons
        ↓
User clicks recipe → opens RecipeModal with full details
```

**Validation:** The chatbot only returns recipe objects that actually exist in MongoDB. Groq cannot invent fake recipes that appear as links.

---

## Email Service Architecture

- **Transport:** Nodemailer with SMTP (Gmail or any provider)
- **Trigger:** When cook submits a recipe
- **Content:** HTML email with recipe name, origin, submitter info, and review link
- **Review Link:** `CLIENT_URL/admin?review=<recipeId>` (requires admin login)
- **Security:** Link does NOT auto-approve — admin must authenticate then manually click Approve
- **Graceful Failure:** SMTP errors are caught, logged, but do not block recipe submission

---

## Frontend Architecture

### State Management
- **Authentication:** React Context (`AuthContext`) with `localStorage` persistence
- **Recipe Data:** Local component state fetched from API
- **UI State:** Component-level `useState` hooks

### Route Protection
- `ProtectedRoute` component checks `user` from AuthContext
- If not logged in → redirects to `/login` with `state.from` for post-login redirect
- If wrong role → shows Access Denied screen (does not redirect)

### API Communication
- All requests go through `axiosInstance.js`
- Base URL: `VITE_API_URL` env variable (fallback: `http://localhost:5000/api`)
- Request interceptor automatically adds `Authorization: Bearer <token>` if logged in

---

## Security Implementation

| Concern | Implementation |
|---------|---------------|
| Password storage | bcryptjs with salt rounds = 10 |
| Authentication | JWT with secret from env var |
| Role enforcement | Both frontend guards + backend middleware |
| Admin creation | Server-only seed script, never via API |
| Image uploads | Multer validates type (jpeg/jpg/png/webp) + 10MB limit |
| CORS | Restricted to `CLIENT_URL` env variable |
| HTTP Security | Helmet middleware (XSS, clickjacking headers) |
| Rate limiting | express-rate-limit on all /api and /api/auth |
| Secrets | All in `.env`, never committed, `.env.example` has placeholders |
| Chatbot abuse | Per-IP rate limit + 500-char input limit |

---

## Error Handling

- **Validation errors:** 400 with descriptive message
- **Authentication errors:** 401 with clear message
- **Authorization errors:** 403 Forbidden
- **Not found:** 404
- **Server errors:** 500 without stack traces in production
- **Cloudinary errors:** Caught, temp files cleaned up, error returned to client
- **SMTP errors:** Caught, logged to console, recipe NOT affected
- **Groq errors:** 502 with friendly fallback message

---

## Dependencies

### Server
| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT generation/verification |
| cors | CORS headers |
| helmet | HTTP security headers |
| express-rate-limit | Rate limiting |
| morgan | HTTP request logging |
| multer | Multipart file upload handling |
| cloudinary | Cloudinary SDK for image uploads |
| nodemailer | SMTP email sending |
| groq-sdk | Groq AI API client |
| dotenv | Environment variable loading |

### Client
| Package | Purpose |
|---------|---------|
| react | UI library |
| react-dom | React DOM renderer |
| react-router-dom | Client-side routing |
| axios | HTTP client |
| react-toastify | Toast notifications |
| lucide-react | Icon library |
| tailwindcss | Utility CSS framework |
| vite | Build tool and dev server |
