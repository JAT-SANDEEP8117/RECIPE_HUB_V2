import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1 className="text-4xl font-black text-white mb-2">Join RecipeHub</h1>
          <p className="text-slate-500">Start your journey as a global gourmet chef.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chef Jat Sandeep"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
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

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
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

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-lg shadow-xl shadow-orange-900/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all mt-4 uppercase tracking-widest">
            <UserPlus size={20} />
            Join Community
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Already a member? {' '}
          <Link to="/login" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
