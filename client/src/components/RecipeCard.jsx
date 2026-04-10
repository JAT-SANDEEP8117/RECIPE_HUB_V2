import React from 'react';
import { ChefHat, Globe2, Leaf, Flame, Clock, ArrowRight } from 'lucide-react';

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div 
      className="group relative bg-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 border border-slate-700 hover:border-orange-500/30 active:scale-95"
      onClick={() => onClick(recipe)}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${recipe.category === 'Veg' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
            {recipe.category === 'Veg' ? <Leaf size={10} /> : <Flame size={10} />}
            {recipe.category}
          </span>
        </div>

        {/* Origin Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-medium text-white/90 drop-shadow-lg">
          <Globe2 size={12} className="text-orange-400" />
          {recipe.origin}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
          {recipe.name}
        </h3>
        
        <div className="flex items-center gap-4 text-slate-400 text-xs mb-4">
          <span className="flex items-center gap-1"><Clock size={12} /> 25 min</span>
          <span className="flex items-center gap-1"><ChefHat size={12} /> Easy</span>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-700/50 hover:bg-orange-600 text-slate-200 hover:text-white text-sm font-semibold transition-all group/btn border border-slate-600 group-hover:border-orange-500/50">
          View Full Recipe
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
