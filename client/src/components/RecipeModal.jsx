import React from 'react';
import { X, Clock, Users, Flame, ChefHat, CheckCircle2, ListPlus, Compass } from 'lucide-react';

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:px-6">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        {/* Left Side: Image */}
        <div className="md:w-5/12 h-64 md:h-auto relative">
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 md:from-transparent to-transparent opacity-60" />
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:hidden p-2 bg-slate-900/50 hover:bg-slate-900 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Right Side: Content */}
        <div className="md:w-7/12 p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-orange-500 uppercase tracking-widest">
                <Compass size={14} />
                {recipe.origin} Special
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {recipe.name}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:flex p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <Clock size={14} className="text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Time</span>
                <span className="text-xs text-slate-200 font-semibold mt-0.5">{recipe.prepTime || '25 min'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <Users size={14} className="text-purple-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Servings</span>
                <span className="text-xs text-slate-200 font-semibold mt-0.5">{recipe.servings || '2-3 People'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <ChefHat size={14} className="text-yellow-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Difficulty</span>
                <span className="text-xs text-slate-200 font-semibold mt-0.5">{recipe.difficulty || 'Easy'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <Flame size={14} className="text-orange-400" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Category</span>
                <span className={`text-xs font-semibold mt-0.5 ${recipe.category === 'Veg' ? 'text-green-400' : 'text-red-400'}`}>
                  {recipe.category}
                </span>
              </div>
            </div>

            {recipe.recipeType && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <ListPlus size={14} className="text-teal-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Meal Type</span>
                  <span className="text-xs text-slate-200 font-semibold mt-0.5">{recipe.recipeType}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-8">
            {/* Ingredients Section */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded-full" />
                Ingredients Needed
              </h3>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-850/40 p-5 rounded-2xl border border-slate-800">
                  {recipe.ingredients.map((ing, index) => {
                    const isObj = typeof ing === 'object' && ing !== null;
                    const ingName = isObj ? ing.name : ing;
                    const ingQty = isObj ? ing.quantity : 'As required';
                    return (
                      <div key={index} className="flex justify-between items-center text-sm border-b border-slate-800/60 pb-2">
                        <span className="text-slate-300 font-medium">{ingName}</span>
                        <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md border border-orange-500/20 font-semibold font-mono">
                          {ingQty}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No ingredients specified.</p>
              )}
            </div>

            {/* Preparation Steps */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded-full" />
                Preparation Steps
              </h3>
              <div className="space-y-4">
                {recipe.procedure && recipe.procedure.length > 0 ? (
                  recipe.procedure.map((step, index) => (
                    <div key={index} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-500 text-sm font-bold group-hover:bg-orange-600 group-hover:text-white transition-all">
                        {index + 1}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed pt-1 flex-1 group-hover:text-white transition-colors">
                        {step}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No instructions specified.</p>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold transition-all shadow-xl shadow-orange-950/20"
          >
            <CheckCircle2 size={18} />
            Close Recipe Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
