# RecipeHub V2 — Technical Documentation

## System Overview

RecipeHub V2 is a full-stack MERN application for discovering, sharing, and managing global recipes. It features a dark navy/orange glassmorphism UI, role-based JWT authentication, AI-powered recipe recommendations via Groq, Cloudinary image storage, newsletter subscriptions, and an admin approval + contributor analytics workflow.

---

## Architecture

```
recipe_hub/
├── client/                    # React 19 + Vite frontend
│   ├── public/images/         # Static recipe images (used for seeding)
│   └── src/
│       ├── api/
│       │   ├── axiosInstance.js   # Axios base URL + Auth interceptor
│       │   └── recipeData.js      # Static category/type arrays
│       ├── components/
│       │   ├── Navbar.jsx         # Floating glassmorphism navbar + profile dropdown
│       │   ├── Footer.jsx         # Compact footer + wired newsletter form
│       │   ├── RecipeCard.jsx     # Card with prep time + difficulty badges
│       │   ├── RecipeModal.jsx    # Full recipe modal with structured ingredients
│       │   ├── Chatbot.jsx        # Groq AI chatbot with scroll-close + textarea
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx    # JWT user state, login/logout, localStorage
│       ├── pages/
│       │   ├── Home.jsx           # Cursor glow, advanced filters, 12-recipe limit
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── AddRecipe.jsx      # Dynamic ingredient rows + metadata fields
│       │   └── AdminDashboard.jsx # Review tabs + Cooks/Contributors tab
│       ├── App.jsx                # Route definitions + ToastContainer
│       ├── main.jsx               # React entry point
│       └── index.css              # Tailwind CSS v4 import
│
└── server/                    # Node.js + Express backend
    ├── config/
    │   ├── db.js              # MongoDB Atlas connection (recipehub DB)
    │   └── multer.js          # Multer disk storage + file type validation
    ├── controllers/
    │   ├── authController.js
    │   ├── recipeController.js    # Includes getContributorsStats aggregation
    │   ├── chatbotController.js   # Groq Llama-3.3-70b integration
    │   └── newsletterController.js
    ├── middleware/
    │   └── authMiddleware.js      # protect + authorize middleware
    ├── models/
    │   ├── User.js
    │   ├── Recipe.js              # Structured ingredients, recipeType, difficulty, etc.
    │   └── Subscriber.js          # Newsletter subscriber schema
    ├── routes/
    │   ├── authRoutes.js
    │   ├── recipeRoutes.js        # Includes /admin/contributors
    │   ├── chatbotRoutes.js
    │   └── newsletterRoutes.js
    ├── scripts/
    │   ├── seedAdmin.js           # Creates admin user from env vars (idempotent)
    │   ├── seedRecipes.js         # Seeds 30 recipes to MongoDB (idempotent)
    │   └── recipes.json           # 30 recipe definitions with structured ingredients
    ├── services/
    │   ├── cloudinaryService.js   # upload + delete helpers
    │   └── emailService.js        # Admin notify + newsletter welcome + recipe alerts
    ├── uploads/                   # Temp disk storage (auto-cleaned after Cloudinary upload)
    └── index.js                   # Express app entry point
```

---

## Database Architecture

### Connection
- **Atlas Cluster:** Shared cluster (may contain other databases)
- **Database Name:** `recipehub` — enforced via `{ dbName: 'recipehub' }` in `mongoose.connect()`

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
  category: String (enum: ['Veg', 'Non-Veg'], required),       // dietary type
  recipeType: String (enum: ['Breakfast','Lunch','Dinner','Snack','Dessert']),
  origin: String (required),                                    // country
  prepTime: String (e.g. '25 min'),
  difficulty: String (enum: ['Easy', 'Medium', 'Hard']),
  servings: String (e.g. '2-3 People'),
  ingredients: [{ name: String, quantity: String }],            // structured
  procedure: [String],
  image: String (Cloudinary secure_url),
  cloudinaryPublicId: String,
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  rejectionReason: String,
  submitterRole: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### `subscribers`
```
{
  _id: ObjectId,
  email: String (required, unique, lowercase),
  subscribedAt: Date (default: Date.now)
}
```

---

## Authentication & Authorization

### JWT Strategy
- Token signed with `process.env.JWT_SECRET`
- Payload: `{ id: user._id }`
- Expiry: 30 days (configurable via `JWT_EXPIRES_IN`)
- Token stored in `localStorage` as `userInfo` JSON object

### Roles
| Role | Can Do |
|------|--------|
| `user` | Browse approved recipes, use chatbot, subscribe to newsletter |
| `cook` | All user permissions + submit recipes (pending review) |
| `admin` | All permissions + review/approve/reject/delete recipes, view contributor stats |

### Middleware
- `protect` — Verifies Bearer token, attaches `req.user` from DB lookup
- `authorize(...roles)` — Checks `req.user.role` is in allowed list, returns 403 if not

### Security Guarantees
- Public `POST /api/auth/register` forces role to `user` or `cook` only — never `admin`
- Admin accounts only via `npm run seed:admin` (server-side script using env vars)
- All sensitive routes protected with both `protect` and `authorize`

### Rate Limiting
- General API: 300 req / 15 min per IP
- Auth routes: 30 req / 15 min per IP (brute-force protection)
- Chatbot: 50 req / 15 min per IP
- Newsletter subscribe: 5 req / 15 min per IP

---

## API Routes

### Authentication (`/api/auth`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/register` | Public | Register as user or cook (not admin) |
| POST | `/login` | Public | Login any role |

### Recipes (`/api/recipes`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/` | Public | Get all **approved** recipes |
| POST | `/` | Cook, Admin | Submit new recipe (multipart/form-data) |
| GET | `/my-recipes` | Cook, Admin | Get logged-in user's own recipes |
| GET | `/admin/all` | Admin only | Get all recipes with status |
| GET | `/admin/contributors` | Admin only | Get contributor stats (aggregation) |
| PATCH | `/:id/review` | Admin only | Approve or reject recipe |
| DELETE | `/:id` | Owner or Admin | Delete recipe + Cloudinary image |

### Chatbot (`/api/chatbot`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/` | Public | Get AI recipe recommendation from Groq |

### Newsletter (`/api/newsletter`)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/subscribe` | Public | Subscribe email (stored in MongoDB, welcome email sent) |

---

## Recipe Submission Workflow

```
Cook fills AddRecipe form (name, category, recipeType, origin,
  prepTime, difficulty, servings, ingredients[], procedure[], image)
        ↓
Frontend sends multipart/form-data POST /api/recipes
        ↓
Multer saves image to uploads/ temporarily
        ↓
Backend uploads image to Cloudinary → receives secure_url + public_id
   Upload failed? ──YES──→ Return error (temp file cleaned up)
        ↓ NO
Save recipe to MongoDB (status: 'pending')
   DB save failed? ──YES──→ Delete Cloudinary image, return error
        ↓ NO
Try send email to ADMIN_EMAIL
   Email failed? ───YES──→ Log error, continue (recipe is safe)
        ↓ NO
Return 201 + recipe to frontend
```

---

## Admin Approval Workflow

```
Admin logs in → /admin Dashboard
        ↓
Stats: total, pending, approved, rejected, contributors count
        ↓
Tabs: Pending | Approved | Rejected | Cooks/Contributors
        ↓
[Recipe tabs] Select recipe → Detail Inspector panel
        ↓
APPROVE → recipe.status = 'approved'
        → recipe visible in public browse
        → newsletter broadcast to all subscribers (async, non-blocking)
OR
REJECT → admin provides rejection reason
       → recipe.status = 'rejected'
OR
DELETE → removes from MongoDB + deletes Cloudinary asset
```

---

## Newsletter Architecture

```
User submits email in Footer form
        ↓
POST /api/newsletter/subscribe
        ↓
Normalize email (trim + lowercase)
        ↓
Check if email already exists in `subscribers` collection
   Duplicate? ──YES──→ 400 "Already subscribed"
        ↓ NO
Create Subscriber document in MongoDB
        ↓
Send welcome email via SMTP (background, non-blocking)
        ↓
Return 201 success

[On Recipe Approval]
Admin approves recipe → reviewRecipe controller
        ↓
Fetch all subscribers from MongoDB
        ↓
Send "New Recipe Alert" email to each subscriber (iterative, non-blocking)
```

---

## Contributor Stats Architecture

`GET /api/recipes/admin/contributors` uses a MongoDB aggregation pipeline:

```js
User.aggregate([
  { $match: { role: { $in: ['cook', 'admin'] } } },
  { $lookup: { from: 'recipes', localField: '_id', foreignField: 'user', as: 'userRecipes' } },
  { $project: {
      name, email, role, createdAt,
      recipeCount: { $size: '$userRecipes' },
      latestRecipeDate: { $max: '$userRecipes.createdAt' }
  }},
  { $sort: { recipeCount: -1 } }
])
```

---

## Cloudinary Architecture

- **Folder:** All recipe images stored in `recipehub/` folder in Cloudinary
- **Upload flow:** Server uploads via `cloudinary.uploader.upload(filePath)` then auto-cleans temp file
- **References stored:** Only `secure_url` (HTTPS URL) and `public_id` in MongoDB
- **Deletion:** When recipe deleted, `cloudinary.uploader.destroy(public_id)` is called
- **Rollback:** If MongoDB save fails after Cloudinary upload, the Cloudinary asset is deleted

---

## Groq AI Chatbot Architecture

```
User types message → textarea (auto-grows, Enter to send, Shift+Enter newline)
        ↓
Frontend sends POST /api/chatbot { message }
        ↓
Backend validates message (non-empty, max 500 chars)
        ↓
Fetch ALL approved recipes from MongoDB
        ↓
Build system prompt with full recipe list as context
        ↓
Call Groq API (llama-3.3-70b-versatile, temp=0.3, max_tokens=800)
        ↓
Parse Groq response text for recipe name matches (word-boundary regex)
        ↓
Return { response: string, recommendedRecipes: Recipe[] }
        ↓
Frontend renders: response text + clickable recipe chip buttons
        ↓
User clicks chip → RecipeModal opens with full details + chatbot auto-closes
```

---

## Frontend Key Behaviors

### Home Page Filter Logic
All 5 filter axes are composed in a single `useMemo`:
1. **Search** — matches recipe name, origin, recipeType, or any ingredient name
2. **Cuisine** (hero pills) — Indian/Italian/Russian/Chinese map to exact DB origins; "Others" catches all remaining
3. **Meal Type** — exact `recipeType` match
4. **Dietary** — `category` field (Veg / Non-Veg)
5. **Difficulty** — Easy / Medium / Hard
6. **Prep Time** — parsed minutes from `prepTime` string

Homepage shows first 12 results. "View All" button reveals all filtered recipes. "Show Less" collapses and scrolls to top.

### Chatbot Behaviors
- Opens with CSS `scale`/`opacity` animation (no mount/unmount flash)
- FAB icon morphs: Bot ↔ X on toggle
- Auto-closes when page scrolled ≥ 120px (tracked via `window.scrollY`)
- Textarea grows vertically up to 100px max-height

### Navbar Behaviors
- Fixed floating position: `top-4 left-4 right-4`, max-width `7xl`, `rounded-2xl`
- Profile dropdown shows real `user.name` and `user.email` from AuthContext
- Admin Dashboard link visible only if `user.role === 'admin'`
- Mobile: hamburger menu with full feature parity

---

## Email Service

| Email Type | Trigger | Recipient |
|---|---|---|
| Review Notification | Cook submits recipe | `ADMIN_EMAIL` |
| Welcome Newsletter | User subscribes in footer | Subscriber's email |
| Recipe Alert | Admin approves recipe | All `subscribers` in MongoDB |

All emails use Nodemailer with SMTP. SMTP failures are caught and logged without blocking the main operation.

---

## Security Implementation

| Concern | Implementation |
|---------|---------------|
| Password storage | bcryptjs, salt rounds = 10 |
| Authentication | JWT signed with `JWT_SECRET` env var |
| Role enforcement | Frontend guards + backend `protect` + `authorize` middleware |
| Admin creation | Server-only seed script, never via public API |
| Image uploads | Multer: jpeg/jpg/png/webp only, 10MB max |
| CORS | Restricted to `CLIENT_URL` env variable |
| HTTP Security | Helmet middleware (CSP, XSS, clickjacking headers) |
| Rate limiting | express-rate-limit: general, auth, chatbot, newsletter tiers |
| Secrets | All in `.env`, never committed, `.env.example` has placeholders |
| Newsletter | Duplicate email check with normalized lowercase comparison |

---

## Error Handling

- **400** — Validation errors, duplicate email, invalid status
- **401** — Missing or invalid JWT token
- **403** — Wrong role (Forbidden)
- **404** — Resource not found
- **500** — Server errors (no stack traces in production)
- **502** — Groq API unavailable (friendly fallback message to user)
- **Cloudinary errors** — Temp files cleaned up; error returned to client
- **SMTP errors** — Caught and logged; recipe submission / approval NOT affected

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
| cloudinary | Image storage and management |
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

---

*RecipeHub V2 — Built with ♥ by Jat Sandeep*
