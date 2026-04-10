import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import Footer from '../components/Footer';
import API from '../api/axiosInstance';
import { recipes as localRecipes, categories } from '../api/recipeData';
import { Sparkles, ChefHat, Loader2 } from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [dbRecipes, setDbRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const allRecipes = useMemo(() => {
    // Combine local featured recipes with DB recipes
    // In a real app, you'd probably just fetch all from DB
    return [...localRecipes, ...dbRecipes];
  }, [dbRecipes]);

  const filteredRecipes = useMemo(() => {
    return allRecipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.origin.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || 
                            recipe.origin === selectedCategory || 
                            recipe.category === selectedCategory ||
                            (selectedCategory === 'Indian' && recipe.origin === 'India') ||
                            (selectedCategory === 'Italian' && recipe.origin === 'Italy') ||
                            (selectedCategory === 'Russian' && recipe.origin === 'Russia') ||
                            (selectedCategory === 'Chinese' && recipe.origin === 'China');
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, allRecipes]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-orange-500/30">
      <Navbar 
        onSearch={setSearchTerm} 
        onFilter={setSelectedCategory} 
        categories={categories}
        currentFilter={selectedCategory}
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.1),rgba(15,23,42,0))]" />
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
            "Cooking is an multi-sensory art. It's about passion, tradition, and the joy of sharing."
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-6 py-2 rounded-full border transition-all text-sm font-semibold active:scale-95 ${
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
      <main className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <ChefHat className="text-orange-500" />
            {selectedCategory === 'All' ? 'Must-Try Recipes' : `${selectedCategory} Specialties`}
            <span className="text-sm font-medium text-slate-500 ml-2 pt-2">({filteredRecipes.length} found)</span>
          </h2>
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onClick={() => setSelectedRecipe(recipe)} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-white mb-2 text-slate-400">No recipes found matching your search.</h3>
            <p className="text-slate-500">Try searching for ingredients, dishes, or countries.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              className="mt-6 text-orange-500 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Modal */}
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
