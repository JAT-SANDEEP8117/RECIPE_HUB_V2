import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { ChefHat, Check, X, ShieldAlert, FileText, AlertCircle, BarChart3, Clock, Eye, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [recipeToReject, setRecipeToReject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/recipes/admin/all');
      setRecipes(data);
    } catch (err) {
      toast.error('Failed to load admin recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Compute Stats in Frontend Memory
  const stats = useMemo(() => {
    const total = recipes.length;
    const pending = recipes.filter(r => r.status === 'pending').length;
    const approved = recipes.filter(r => r.status === 'approved').length;
    const rejected = recipes.filter(r => r.status === 'rejected').length;
    
    // Count unique cooks/users
    const uniqueUsers = new Set(recipes.map(r => r.user?._id).filter(Boolean));
    const totalContributors = uniqueUsers.size;

    return { total, pending, approved, rejected, totalContributors };
  }, [recipes]);

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this recipe? It will immediately go public.')) return;
    setIsSubmitting(true);
    try {
      await API.patch(`/recipes/${id}/review`, { status: 'approved' });
      toast.success('Recipe approved successfully!');
      fetchRecipes();
      if (selectedRecipe && selectedRecipe._id === id) setSelectedRecipe(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = (recipe) => {
    setRecipeToReject(recipe);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      return toast.warning('Please enter a rejection reason.');
    }
    setIsSubmitting(true);
    try {
      await API.patch(`/recipes/${recipeToReject._id}/review`, { 
        status: 'rejected', 
        reason: rejectReason 
      });
      toast.error('Recipe rejected.');
      setShowRejectModal(false);
      setRecipeToReject(null);
      fetchRecipes();
      if (selectedRecipe && selectedRecipe._id === recipeToReject._id) setSelectedRecipe(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this recipe? This cannot be undone and will delete the image from Cloudinary.')) return;
    try {
      await API.delete(`/recipes/${id}`);
      toast.success('Recipe deleted permanently.');
      fetchRecipes();
      if (selectedRecipe && selectedRecipe._id === id) setSelectedRecipe(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  const filteredList = useMemo(() => {
    return recipes.filter(r => r.status === activeTab);
  }, [recipes, activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3">
              <ShieldAlert className="text-orange-500" /> Admin Control Dashboard
            </h1>
            <p className="text-slate-400 text-sm">Review, approve, and manage site-wide recipe submissions.</p>
          </div>
          <button 
            onClick={fetchRecipes} 
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-sm font-semibold transition-all"
          >
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2 text-slate-500"><BarChart3 size={18} /> Total</div>
            <div className="text-3xl font-black text-white">{stats.total}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-2 text-amber-500"><Clock size={18} /> Pending</div>
            <div className="text-3xl font-black text-white">{stats.pending}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-2 text-green-500"><Check size={18} /> Approved</div>
            <div className="text-3xl font-black text-white">{stats.approved}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl border-l-4 border-l-red-500">
            <div className="flex items-center justify-between mb-2 text-red-500"><X size={18} /> Rejected</div>
            <div className="text-3xl font-black text-white">{stats.rejected}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-2 text-slate-500"><ChefHat size={18} /> Cooks</div>
            <div className="text-3xl font-black text-white">{stats.totalContributors}</div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
              {['pending', 'approved', 'rejected'].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSelectedRecipe(null); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                    activeTab === tab 
                      ? 'bg-orange-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab} ({recipes.filter(r => r.status === tab).length})
                </button>
              ))}
            </div>

            {/* List */}
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredList.length > 0 ? (
              <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="divide-y divide-slate-900">
                  {filteredList.map(recipe => (
                    <div 
                      key={recipe._id}
                      className={`p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40 transition-colors ${
                        selectedRecipe?._id === recipe._id ? 'bg-slate-900/80 border-r-4 border-orange-500' : ''
                      }`}
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={recipe.image} 
                          alt={recipe.name} 
                          className="w-16 h-16 rounded-xl object-cover bg-slate-800 border border-slate-700"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop'; }}
                        />
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{recipe.name}</h3>
                          <p className="text-xs text-slate-500">Origin: {recipe.origin} | Submitted by: {recipe.user?.name || 'Seeded System'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => setSelectedRecipe(recipe)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                          title="Inspect Details"
                        >
                          <Eye size={16} />
                        </button>
                        {recipe.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(recipe._id)}
                              disabled={isSubmitting}
                              className="p-2 bg-green-500/20 hover:bg-green-600 text-green-400 hover:text-white rounded-lg disabled:opacity-50"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => handleRejectClick(recipe)}
                              disabled={isSubmitting}
                              className="p-2 bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg disabled:opacity-50"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(recipe._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-600/30 text-red-400 rounded-lg"
                          title="Delete permanently"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center bg-slate-900/10 border border-slate-800/50 rounded-3xl">
                <AlertCircle className="mx-auto text-slate-600 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-400">No {activeTab} submissions</h3>
                <p className="text-xs text-slate-600 mt-1">Excellent! The kitchen queues are clear.</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl h-fit">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText size={18} className="text-orange-500" /> Detail Inspector
            </h2>

            {selectedRecipe ? (
              <div className="space-y-6">
                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.name} 
                  className="w-full h-44 object-cover rounded-xl border border-slate-800 bg-slate-800 shadow"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop'; }}
                />
                <div>
                  <h3 className="text-2xl font-black text-white">{selectedRecipe.name}</h3>
                  <span className="inline-block mt-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedRecipe.category} • {selectedRecipe.origin}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Submitted By</h4>
                  <p className="text-sm text-slate-300">{selectedRecipe.user?.name || 'Seeded'}</p>
                  <p className="text-xs text-slate-500">{selectedRecipe.user?.email || 'N/A'}</p>
                </div>

                {selectedRecipe.status === 'rejected' && (
                  <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-xs">
                    <span className="font-bold">Rejection Reason:</span> {selectedRecipe.rejectionReason}
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ingredients</h4>
                  {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                      {selectedRecipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-600">No ingredients specified in record.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Steps Procedure</h4>
                  <ol className="space-y-3 text-sm text-slate-300">
                    {selectedRecipe.procedure.map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-orange-500 font-bold">{idx + 1}.</span>
                        <span className="flex-1 leading-relaxed text-xs">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {selectedRecipe.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleApprove(selectedRecipe._id)}
                      disabled={isSubmitting}
                      className="py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow"
                    >
                      <Check size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleRejectClick(selectedRecipe)}
                      disabled={isSubmitting}
                      className="py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow"
                    >
                      <X size={16} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-600 text-xs">
                Select a recipe from the list to inspect full details, ingredients, and steps.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-slate-900 rounded-3xl border border-slate-800 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <AlertCircle size={20} className="text-red-500" /> Reject Recipe Submission
            </h3>
            <p className="text-xs text-slate-500 mb-6">Explain to the cook why this recipe cannot be accepted.</p>
            
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows="4"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Describe rejection reason, e.g. Missing measurements for baking powder, blurry image..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-red-500/50 outline-none transition-all text-sm resize-none"
              />
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
