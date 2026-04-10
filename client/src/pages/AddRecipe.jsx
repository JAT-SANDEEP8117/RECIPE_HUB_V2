import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Camera, Plus, Minus, Send, MapPin, ChefHat, Info, Loader2 } from 'lucide-react';
import { categories, types } from '../api/recipeData';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const AddRecipe = () => {
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [category, setCategory] = useState('Indian');
  const [dietaryType, setDietaryType] = useState('Veg');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));
  
  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return setError('You must be logged in to add a recipe');
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('origin', origin);
    formData.append('category', dietaryType); // Logic uses 'category' for Veg/Non-Veg in the model
    formData.append('ingredients', JSON.stringify(ingredients.filter(i => i.trim() !== '')));
    formData.append('procedure', JSON.stringify(steps.filter(s => s.trim() !== '')));
    if (image) {
      formData.append('image', image);
    }

    try {
      await API.post('/recipes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
   
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center bg-slate-900 p-12 rounded-3xl border border-slate-800">
          <ChefHat size={64} className="mx-auto text-orange-500 mb-6" />
          <h2 className="text-3xl font-black text-white mb-4">Chef Authentication Required</h2>
          <p className="text-slate-400 mb-8">Please login to contribute your legendary recipes to our global map.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="px-8 py-3 bg-orange-600 rounded-xl font-bold hover:bg-orange-500 transition-all">Login</button>
            <button onClick={() => navigate('/')} className="px-8 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-all">Go Home</button>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-4">Share Your Culinary Legend</h1>
            <p className="text-slate-400">Your tradition deserves to be part of our global tapestry.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-10" onSubmit={handleSubmit}>
            {/* Essential Info Section */}
            <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-8 text-orange-500 font-bold uppercase tracking-widest text-xs">
                <Info size={16} />
                Essential Information
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Recipe Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Grandma's Secret Biryani"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Country of Origin</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      required
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="e.g. India"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Dietary Type</label>
                  <select 
                    value={dietaryType}
                    onChange={(e) => setDietaryType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {types.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-8 text-orange-500 font-bold uppercase tracking-widest text-xs">
                 <div className="flex items-center gap-2">
                   <ChefHat size={16} />
                   Ingredients
                 </div>
                 <button 
                  type="button" 
                  onClick={addIngredient}
                  className="flex items-center gap-1 text-orange-400 hover:text-white transition-colors"
                 >
                   <Plus size={14} /> Add One
                 </button>
              </div>
              
              <div className="space-y-3">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input 
                      type="text" 
                      required
                      value={ing}
                      onChange={(e) => {
                        const newIngs = [...ingredients];
                        newIngs[idx] = e.target.value;
                        setIngredients(newIngs);
                      }}
                      placeholder="e.g. 2 tbsp Olive Oil"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all text-sm"
                    />
                    {ingredients.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeIngredient(idx)}
                        className="p-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-xl transition-all border border-slate-700"
                      >
                        <Minus size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Section */}
            <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-8 text-orange-500 font-bold uppercase tracking-widest text-xs">
                 <div className="flex items-center gap-2">
                   <Plus size={16} />
                   Step-by-Step Procedure
                 </div>
                 <button 
                  type="button" 
                  onClick={addStep}
                  className="flex items-center gap-1 text-orange-400 hover:text-white transition-colors"
                 >
                   <Plus size={14} /> Add Step
                 </button>
              </div>
              
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-500 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <textarea 
                      rows="2"
                      required
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[idx] = e.target.value;
                        setSteps(newSteps);
                      }}
                      placeholder="Describe this step in detail..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all text-sm resize-none"
                    />
                    {steps.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeStep(idx)}
                        className="self-center p-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-xl transition-all border border-slate-700"
                      >
                        <Minus size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-8 text-orange-500 font-bold uppercase tracking-widest text-xs">
                <Camera size={16} />
                Captivating Visuals
              </div>
              
              <label className="block border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center hover:bg-slate-800/30 transition-all cursor-pointer group relative overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                ) : null}
                <div className="relative z-10">
                  <div className="p-4 bg-slate-800 rounded-full w-fit mx-auto mb-4 group-hover:bg-orange-600/20 group-hover:text-orange-400 transition-all text-slate-500">
                    <Camera size={32} />
                  </div>
                  <h3 className="text-white font-bold mb-1">{image ? image.name : 'Click to upload image'}</h3>
                  <p className="text-xs text-slate-500">PNG or JPG (max. 10MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full py-5 rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xl shadow-2xl shadow-orange-900/30 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT RECIPE'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddRecipe;
