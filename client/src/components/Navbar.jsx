import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Search, PlusCircle, LogIn, LogOut, Shield, ChefHat, User, Menu, X, ChevronDown, Calendar, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onSearch, showSearch = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMyRecipesClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/?filter=my-recipes');
  };

  return (
    <>
      <nav className="fixed top-4 left-4 right-4 z-50 bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-2xl shadow-2xl max-w-7xl mx-auto transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-black bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent shrink-0">
              <UtensilsCrossed className="text-orange-500" size={24} />
              RecipeHub
            </Link>

            {/* Global Search (Desktop) */}
            {showSearch && onSearch && (
              <div className="hidden md:flex flex-1 max-w-md relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search global delicacies..."
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-500"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            )}

            {/* Navigation & User Controls */}
            <div className="hidden md:flex items-center gap-4">
              {user && (user.role === 'cook' || user.role === 'admin') && (
                <Link to="/add-recipe" className="flex items-center gap-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-orange-950/20 active:scale-95 text-white">
                  <PlusCircle size={14} />
                  Add Recipe
                </Link>
              )}

              {user ? (
                /* Profile Dropdown Trigger */
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded-full focus:outline-none transition-all active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                      {getInitials(user.name)}
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-185' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-850 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate mt-0.5">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      
                      <div className="p-1.5 space-y-0.5">
                        <button 
                          onClick={() => { setDropdownOpen(false); setShowProfileModal(true); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all text-left"
                        >
                          <User size={14} className="text-slate-400" />
                          My Profile
                        </button>
                        
                        <button 
                          onClick={handleMyRecipesClick}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all text-left"
                        >
                          <ChefHat size={14} className="text-slate-400" />
                          My Recipes
                        </button>

                        {user.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            onClick={() => setDropdownOpen(false)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all text-left"
                          >
                            <Shield size={14} className="text-orange-400" />
                            Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-800 p-1.5 mt-1.5">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-left"
                        >
                          <LogOut size={14} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 text-sm font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700/60 px-4 py-2 rounded-xl transition-all text-white">
                  <LogIn size={15} />
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              {user && (user.role === 'cook' || user.role === 'admin') && (
                <Link to="/add-recipe" className="flex items-center justify-center p-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-white">
                  <PlusCircle size={18} />
                </Link>
              )}
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded-xl text-slate-200"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900/95 rounded-b-2xl p-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Mobile Search */}
            {showSearch && onSearch && (
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  type="text"
                  placeholder="Search global delicacies..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-orange-500"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            )}

            {/* Mobile Options */}
            <div className="space-y-1">
              {user ? (
                <>
                  <div className="px-3 py-2 bg-slate-850 rounded-xl mb-2">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Account</p>
                    <p className="text-sm font-bold text-white mt-0.5">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  
                  <button 
                    onClick={() => { setMobileMenuOpen(false); setShowProfileModal(true); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl"
                  >
                    <User size={14} className="text-slate-400" />
                    My Profile
                  </button>

                  <button 
                    onClick={handleMyRecipesClick}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl"
                  >
                    <ChefHat size={14} className="text-slate-400" />
                    My Recipes
                  </button>

                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl"
                    >
                      <Shield size={14} className="text-orange-400" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 rounded-xl"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-xl text-xs font-bold text-white text-center"
                >
                  <LogIn size={14} />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent navbar overlapping page content */}
      <div className="h-24"></div>

      {/* Premium Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" onClick={() => setShowProfileModal(false)} />
          <div className="relative bg-slate-900 border border-slate-800 max-w-md w-full rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-350">
            
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
            >
              <X size={18} />
            </button>

            {/* Profile Detail Header */}
            <div className="text-center pb-6 border-b border-slate-800">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-orange-950/30 mb-4">
                {getInitials(user.name)}
              </div>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {user.role}
              </span>
            </div>

            {/* Profile Info Fields */}
            <div className="py-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 text-slate-400 rounded-lg">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-slate-200">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 text-slate-400 rounded-lg">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Joined Date</p>
                  <p className="text-sm font-semibold text-slate-200">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'July 9, 2026'}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowProfileModal(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Close Profile
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
