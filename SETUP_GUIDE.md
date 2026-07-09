# RecipeHub V2 — Complete Setup Guide

A beginner-friendly guide to configure every service and get RecipeHub running locally and in production.

---

## Prerequisites

- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **npm** v9+ (bundled with Node.js)
- **Git** — [git-scm.com](https://git-scm.com)
- A **MongoDB Atlas** account (free) — [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register)
- A **Cloudinary** account (free) — [cloudinary.com](https://cloudinary.com)
- A **Groq** account (free) — [console.groq.com](https://console.groq.com)
- A **Gmail** account for SMTP (or any SMTP provider)

---

## 1. Clone / Open the Project

```bash
git clone <repository-url>
cd recipe_hub
```

---

## 2. Install Dependencies

### Frontend (client)
```bash
cd client
npm install
```

### Backend (server)
```bash
cd ../server
npm install
```

---

## 3. MongoDB Atlas Setup

### Step 1 — Create Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account and a new **Project**
3. Deploy a **Free Cluster (M0 Sandbox)**

### Step 2 — Create a Database User
1. In the Atlas sidebar → **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Set a username and strong password
5. Under **Privileges** → choose **Read and write to any database**
6. Click **Add User**

### Step 3 — Configure Network Access
1. In the Atlas sidebar → **Network Access**
2. Click **Add IP Address**
3. For development: click **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Click **Confirm**

### Step 4 — Get Connection String
1. In Atlas sidebar → **Database** → click **Connect** on your cluster
2. Choose **Drivers**
3. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5 — Configure `.env`
Create `server/.env` (copy from `server/.env.example`):
```env
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.abcde.mongodb.net/recipehub?retryWrites=true&w=majority
```

> **Important:** The app always connects to the `recipehub` database (enforced in code). This will not interfere with any other databases in your cluster (e.g. Spend Smart).

---

## 4. Backend Environment Setup

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/recipehub?retryWrites=true&w=majority

JWT_SECRET=pick_a_long_random_string_here
JWT_EXPIRES_IN=30d

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=Admin@123

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
MAIL_FROM="RecipeHub Alerts" <noreply@recipehub.com>

GROQ_API_KEY=gsk_your_groq_key_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

---

## 5. Frontend Environment Setup

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

> **Never put** MongoDB URI, JWT secret, SMTP passwords, Cloudinary secrets, or Groq API keys in frontend env files.

---

## 6. Cloudinary Setup

Cloudinary is used to store all recipe images in the cloud.

### Step 1 — Create Account
1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account

### Step 2 — Find Your Credentials
1. After logging in, you land on the **Dashboard**
2. You will see a **Product Environment Credentials** card showing:
   - **Cloud Name** — e.g. `dxxxxxxx`
   - **API Key** — e.g. `123456789012345`
   - **API Secret** — e.g. `abc_xxx_yyy` (click the eye icon to reveal)

### Step 3 — Add to `.env`
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 4 — Test an Upload
1. Start the backend: `cd server && npm run dev`
2. Register as a Cook and submit a recipe with an image
3. In Cloudinary Dashboard → **Media Library** → look for a `recipehub/` folder
4. Your uploaded image should appear there

### How Images Are Stored
- Image file is uploaded to Cloudinary via the backend
- Cloudinary returns a `secure_url` (HTTPS URL) and a `public_id`
- Only the `secure_url` and `public_id` are stored in MongoDB
- If saving to MongoDB fails after upload, the Cloudinary image is automatically deleted

### Common Cloudinary Errors
| Error | Fix |
|-------|-----|
| `Invalid cloud_name` | Check `CLOUDINARY_CLOUD_NAME` in `.env` |
| `Must supply api_key` | Check `CLOUDINARY_API_KEY` in `.env` |
| `Upload preset not found` | Don't use unsigned presets — leave blank |
| Image not appearing | Restart server after editing `.env` |

---

## 7. Gmail SMTP Setup (Nodemailer)

RecipeHub emails the admin when a cook submits a recipe.

### Step 1 — Enable 2-Factor Authentication on Gmail
You need 2FA enabled before you can create an App Password.
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Under **How you sign in to Google** → click **2-Step Verification** → enable it

### Step 2 — Create a Gmail App Password
> ⚠️ Never use your regular Gmail password in the app — use an App Password instead.

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Under **Select app** → choose **Mail**
3. Under **Select device** → choose **Other (custom name)** → type `RecipeHub`
4. Click **Generate**
5. Copy the 16-character password shown (e.g. `abcd efgh ijkl mnop`)

### Step 3 — Add to `.env`
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=abcdefghijklmnop   # The 16-char App Password, no spaces
MAIL_FROM="RecipeHub Alerts" <noreply@recipehub.com>
ADMIN_EMAIL=your_admin_email@gmail.com
```

### Step 4 — Test Email
1. Register as a Cook and submit a recipe
2. Check the admin email inbox for a review notification
3. Check server terminal — it logs `Review notification email sent: <messageId>`

### Email Failure Handling
If SMTP fails, the recipe is **still saved** — the server logs the error but does not delete the submission. Check server logs to debug SMTP issues.

---

## 8. Groq API Setup

RecipeHub uses Groq's Llama-3 model as the AI recipe chatbot.

### Step 1 — Create Account
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account

### Step 2 — Get API Key
1. In the Groq console → **API Keys**
2. Click **Create API Key**
3. Give it a name like `RecipeHub`
4. Copy the key (starts with `gsk_`)

### Step 3 — Add to `.env`
```env
GROQ_API_KEY=gsk_your_api_key_here
```

### Step 4 — Test Chatbot
1. Start both frontend and backend
2. Open the app in browser
3. Click the 🤖 button in the bottom-right corner
4. Type: `Suggest me a vegetarian recipe`
5. The bot should recommend real recipes from the database with clickable links

---

## 9. Admin Setup

### Step 1 — Configure Admin Credentials
In `server/.env`:
```env
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=Admin@123
```

### Step 2 — Seed the Admin User
```bash
cd server
npm run seed:admin
```

This script:
- Checks if the admin already exists
- If not, creates the admin with a hashed password
- Is safe to run multiple times (idempotent)

### Step 3 — Login as Admin
1. Open the app
2. Click **Login** in the navbar
3. Use the admin email and password
4. You will be automatically redirected to the **Admin Dashboard**

---

## 10. Recipe Migration (Seed Existing Recipes)

### Prerequisites
- Admin user must exist (`npm run seed:admin` completed)
- Cloudinary credentials must be configured in `.env`

### Run the Migration
```bash
cd server
npm run seed:recipes
```

This script:
- Reads all 26 pre-existing recipes from `scripts/recipes.json`
- Uploads each recipe image from `client/public/images/` to Cloudinary
- Saves each recipe to MongoDB as `approved` under the admin user
- Skips recipes that already exist (idempotent — safe to rerun)

### Verify Migration
1. Start the app
2. Home page should now show all recipes loaded from MongoDB
3. Check server terminal — each recipe upload is logged

---

## 11. Development Commands

### Start Backend
```bash
cd server
npm run dev       # With nodemon auto-reload
# or
npm start         # Production start
```

### Start Frontend
```bash
cd client
npm run dev       # Vite dev server at http://localhost:5173
```

### Start Both (Windows)
Open two terminals and run the above commands separately.
The old `start-all.bat` has been removed. Use the npm scripts above.

---

## 12. Production Build

### Build Frontend
```bash
cd client
npm run build     # Creates optimized build in client/dist/
npm run preview   # Preview production build locally
```

### Production Environment Variables
For deployment, set these server environment variables on your hosting platform:
- `NODE_ENV=production`
- `CLIENT_URL=https://your-production-domain.com`
- All database, Cloudinary, SMTP, and Groq variables

---

## 13. Deployment Overview

### Backend Deployment (e.g. Render, Railway, Fly.io)
1. Push server code to GitHub
2. Create a new Web Service pointing to the `server/` directory
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add all environment variables from `server/.env.example`

### Frontend Deployment (e.g. Vercel, Netlify)
1. Push client code to GitHub
2. Create a new project pointing to the `client/` directory
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add: `VITE_API_URL=https://your-backend-url.com/api`

### CORS Configuration
Update `CLIENT_URL` in the server environment to match your deployed frontend URL.

---

## 14. Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot connect to MongoDB` | Check `MONGO_URI` format, network access in Atlas |
| `JWT_SECRET is undefined` | Add `JWT_SECRET` to `server/.env` |
| `Cloudinary upload failed` | Verify all three Cloudinary vars in `.env` |
| `SMTP authentication failed` | Use App Password, not regular Gmail password |
| `Groq API key not configured` | Add `GROQ_API_KEY` to `server/.env` |
| Admin can't login | Run `npm run seed:admin` first |
| Recipes not showing | Run `npm run seed:recipes` after admin seed |
| `CORS error` in browser | Ensure `CLIENT_URL` in server `.env` matches frontend URL |
| Port 5000 already in use | Change `PORT=5001` in server `.env` |

---

*RecipeHub V2 — Built with ♥ by Jat Sandeep*
