import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-recipe" element={<AddRecipe />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
