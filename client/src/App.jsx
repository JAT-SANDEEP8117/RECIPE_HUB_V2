import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="dark" 
        toastClassName="bg-slate-900 border border-slate-800 text-slate-200" 
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Cook & Admin Route */}
        <Route 
          path="/add-recipe" 
          element={
            <ProtectedRoute allowedRoles={['cook', 'admin']}>
              <AddRecipe />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Admin Only Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
