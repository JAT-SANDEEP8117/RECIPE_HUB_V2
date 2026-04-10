import React from 'react';
import { Mail, Facebook, Twitter, Instagram, Github, UtensilsCrossed } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-orange-500 w-2 h-8 rounded-full"></span>
              RecipeHub
            </h3>
            <p className="max-w-md mb-6 leading-relaxed">
              Explore global culinary traditions and share your favorite recipes with our vibrant community. 
              From the spicy streets of India to the elegant kitchens of Italy, we bring the world to your table.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-orange-400 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-orange-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-orange-400 transition-colors"><Github size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Popular Recipes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cooking Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Add Recipe</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Newsletter</h4>
            <p className="text-xs mb-4">Get the latest recipes delivered to your inbox weekly.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-slate-800 border-none rounded-lg py-2 px-3 text-xs w-full focus:ring-1 focus:ring-orange-500 outline-none" 
              />
              <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2025 RecipeHub. Designed & Developed with ♥ by Jat Sandeep.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
