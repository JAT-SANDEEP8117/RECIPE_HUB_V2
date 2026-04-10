@echo off
echo Starting RecipeHub (MERN Edition)...

start cmd /k "cd client && npm run dev"
start cmd /k "cd server && npm start"

echo.
echo ====================================================
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo ====================================================
echo.
echo Make sure you have added your MONGO_URI to server/.env
echo See MONGODB_SETUP.md for instructions.
