import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Search, Filter, LogIn, PlusCircle } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Navbar = ({ onSearch, onFilter, categories, currentFilter }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-xl border-b border-slate-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            <UtensilsCrossed className="text-orange-500" />
            RecipeHub
          </Link>

          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-400 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search global delicacies..."
              className="w-full bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-slate-100 focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-500"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4">
              {['Indian', 'Italian', 'Chinese', 'Others'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => onFilter(cat)}
                  className={`text-sm font-medium hover:text-orange-400 transition-colors ${currentFilter === cat ? 'text-orange-500' : 'text-slate-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
              <Link to="/add-recipe" className="flex items-center gap-1.5 text-sm font-semibold bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg transition-all shadow-lg shadow-orange-900/20 active:scale-95">
                <PlusCircle size={16} />
                Add Recipe
              </Link>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-orange-400">Hello, {user.name.split(' ')[0]}</span>
                  <button onClick={logout} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                  <LogIn size={16} />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
