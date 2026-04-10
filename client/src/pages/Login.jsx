import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          Back to Recipes
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-slate-500">Log in to sync your favorite global recipes.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@recipehub.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-slate-400">Password</label>
              <a href="#" className="text-xs text-orange-500 hover:text-orange-400 transition-colors font-medium">Forgot?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-lg shadow-xl shadow-orange-900/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all mt-4">
            <LogIn size={20} />
            LOGIN
          </button>
        </form>

        <p className="text-center mt-10 text-slate-500 text-sm">
          New to RecipeHub? {' '}
          <Link to="/register" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
