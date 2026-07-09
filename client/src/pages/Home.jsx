import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import API from '../api/axiosInstance';
import { categories } from '../api/recipeData';
import { Sparkles, ChefHat, Loader2, SlidersHorizontal, X, ChevronDown, ChevronUp, Search } from 'lucide-react';

const RECIPE_TYPES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
const DIETARY_TYPES = ['All', 'Veg', 'Non-Veg'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const PREP_TIMES = ['All', 'Under 15 min', 'Under 30 min', 'Under 60 min'];
const HOME_LIMIT = 12;

const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer appearance-none"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [dbRecipes, setDbRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Advanced filters
  const [filterRecipeType, setFilterRecipeType] = useState('All');
  const [filterDietary, setFilterDietary] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterPrepTime, setFilterPrepTime] = useState('All');

  // Cursor glow
  const heroRef = useRef(null);
  const glowRef = useRef(null);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const handleMouseMove = useCallback((e) => {
    if (prefersReducedMotion.current || !glowRef.current || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(249,115,22,0.12), transparent 65%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) {
      glowRef.current.style.background = 'transparent';
    }
  }, []);

  // Fetch recipes from DB
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await API.get('/recipes');
        setDbRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const getPrepMinutes = (prepTime) => {
    if (!prepTime) return 999;
    const match = prepTime.match(/(\d+)/);
    return match ? parseInt(match[1]) : 999;
  };

  const filteredRecipes = useMemo(() => {
    return dbRecipes.filter(recipe => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchesSearch = !search ||
        recipe.name.toLowerCase().includes(search) ||
        recipe.origin.toLowerCase().includes(search) ||
        (recipe.recipeType && recipe.recipeType.toLowerCase().includes(search)) ||
        (recipe.ingredients && recipe.ingredients.some(ing => {
          const name = typeof ing === 'object' ? ing.name : ing;
          return name.toLowerCase().includes(search);
        }));

      // Cuisine category filter (hero buttons)
      const mainOrigins = ['India', 'Italy', 'Russia', 'China'];
      const matchesCuisine = selectedCategory === 'All' ||
        recipe.origin === selectedCategory ||
        (selectedCategory === 'Indian' && recipe.origin === 'India') ||
        (selectedCategory === 'Italian' && recipe.origin === 'Italy') ||
        (selectedCategory === 'Russian' && recipe.origin === 'Russia') ||
        (selectedCategory === 'Chinese' && recipe.origin === 'China') ||
        (selectedCategory === 'Others' && !mainOrigins.includes(recipe.origin));

      // Advanced filters
      const matchesRecipeType = filterRecipeType === 'All' || recipe.recipeType === filterRecipeType;
      const matchesDietary = filterDietary === 'All' || recipe.category === filterDietary;
      const matchesDifficulty = filterDifficulty === 'All' || recipe.difficulty === filterDifficulty;

      let matchesPrepTime = true;
      if (filterPrepTime !== 'All') {
        const mins = getPrepMinutes(recipe.prepTime);
        if (filterPrepTime === 'Under 15 min') matchesPrepTime = mins < 15;
        else if (filterPrepTime === 'Under 30 min') matchesPrepTime = mins < 30;
        else if (filterPrepTime === 'Under 60 min') matchesPrepTime = mins < 60;
      }

      return matchesSearch && matchesCuisine && matchesRecipeType && matchesDietary && matchesDifficulty && matchesPrepTime;
    });
  }, [searchTerm, selectedCategory, filterRecipeType, filterDietary, filterDifficulty, filterPrepTime, dbRecipes]);

  const hasActiveFilters = filterRecipeType !== 'All' || filterDietary !== 'All' || filterDifficulty !== 'All' || filterPrepTime !== 'All';

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setFilterRecipeType('All');
    setFilterDietary('All');
    setFilterDifficulty('All');
    setFilterPrepTime('All');
    setShowAll(false);
  };

  const displayedRecipes = showAll ? filteredRecipes : filteredRecipes.slice(0, HOME_LIMIT);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-orange-500/30">
      <Navbar onSearch={setSearchTerm} showSearch={true} />

      {/* Hero Section with cursor glow */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative py-20 overflow-hidden border-b border-slate-900"
      >
        {/* Static radial background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.08),rgba(15,23,42,0))]" />
        {/* Cursor-following glow layer */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none transition-[background] duration-100"
          style={{ background: 'transparent' }}
        />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6 animate-bounce">
            <Sparkles size={14} />
            Discover the World on Your Plate
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Master the Art of <br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Global Cuisine
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed italic">
            "Cooking is a multi-sensory art. It's about passion, tradition, and the joy of sharing."
          </p>

          {/* Cuisine Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setShowAll(false); }}
                className={`px-5 py-2 rounded-full border transition-all text-sm font-semibold active:scale-95 ${
                  selectedCategory === cat
                  ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <main className="container mx-auto px-4 py-12">

        {/* Section Header + Filter Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <ChefHat className="text-orange-500" />
            {selectedCategory === 'All' ? 'Must-Try Recipes' : `${selectedCategory} Specialties`}
            <span className="text-sm font-medium text-slate-500 mt-1">({filteredRecipes.length} found)</span>
          </h2>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-orange-600/20 border-orange-500/50 text-orange-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 w-5 h-5 bg-orange-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                !
              </span>
            )}
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Advanced Filter Panel */}
        {showFilters && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FilterSelect
                label="Meal Type"
                value={filterRecipeType}
                options={RECIPE_TYPES}
                onChange={(v) => { setFilterRecipeType(v); setShowAll(false); }}
              />
              <FilterSelect
                label="Dietary"
                value={filterDietary}
                options={DIETARY_TYPES}
                onChange={(v) => { setFilterDietary(v); setShowAll(false); }}
              />
              <FilterSelect
                label="Difficulty"
                value={filterDifficulty}
                options={DIFFICULTIES}
                onChange={(v) => { setFilterDifficulty(v); setShowAll(false); }}
              />
              <FilterSelect
                label="Prep Time"
                value={filterPrepTime}
                options={PREP_TIMES}
                onChange={(v) => { setFilterPrepTime(v); setShowAll(false); }}
              />
            </div>

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-500 font-semibold">Active:</span>
                {filterRecipeType !== 'All' && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full text-xs font-semibold">
                    {filterRecipeType}
                    <button onClick={() => setFilterRecipeType('All')}><X size={10} /></button>
                  </span>
                )}
                {filterDietary !== 'All' && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full text-xs font-semibold">
                    {filterDietary}
                    <button onClick={() => setFilterDietary('All')}><X size={10} /></button>
                  </span>
                )}
                {filterDifficulty !== 'All' && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full text-xs font-semibold">
                    {filterDifficulty}
                    <button onClick={() => setFilterDifficulty('All')}><X size={10} /></button>
                  </span>
                )}
                {filterPrepTime !== 'All' && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full text-xs font-semibold">
                    {filterPrepTime}
                    <button onClick={() => setFilterPrepTime('All')}><X size={10} /></button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-xs text-slate-500 hover:text-red-400 transition-colors underline"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 size={40} className="animate-spin text-orange-500" />
            <p className="text-slate-400 text-sm">Loading delicious recipes...</p>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedRecipes.map(recipe => (
                <RecipeCard
                  key={recipe._id || recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>

            {/* View All / Show Less Controls */}
            {filteredRecipes.length > HOME_LIMIT && (
              <div className="mt-12 text-center">
                {!showAll ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-500">
                      Showing <span className="text-white font-semibold">{HOME_LIMIT}</span> of <span className="text-orange-400 font-semibold">{filteredRecipes.length}</span> recipes
                    </p>
                    <button
                      onClick={() => setShowAll(true)}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-950/30 transition-all active:scale-95"
                    >
                      <Search size={16} />
                      View All {filteredRecipes.length} Recipes
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setShowAll(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-all text-sm"
                  >
                    <ChevronUp size={15} />
                    Show Less
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">No recipes found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or filters.</p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Floating Chatbot */}
      <Chatbot onSelectRecipe={(recipe) => setSelectedRecipe(recipe)} />

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default Home;
