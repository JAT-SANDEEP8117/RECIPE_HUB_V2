import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { 
  ChefHat, Check, X, ShieldAlert, FileText, AlertCircle, 
  BarChart3, Clock, Eye, Trash2, Users, Star, Calendar, Mail, Award
} from 'lucide-react';

const AdminDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contributorsLoading, setContributorsLoading] = useState(false);
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

  const fetchContributors = async () => {
    setContributorsLoading(true);
    try {
      const { data } = await API.get('/recipes/admin/contributors');
      setContributors(data);
    } catch (err) {
      toast.error('Failed to load contributors data.');
    } finally {
      setContributorsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (activeTab === 'contributors') {
      fetchContributors();
    }
  }, [activeTab]);

  // Compute Stats
  const stats = useMemo(() => {
    const total = recipes.length;
    const pending = recipes.filter(r => r.status === 'pending').length;
    const approved = recipes.filter(r => r.status === 'approved').length;
    const rejected = recipes.filter(r => r.status === 'rejected').length;
    const uniqueUsers = new Set(recipes.map(r => r.user?._id).filter(Boolean));
    return { total, pending, approved, rejected, totalContributors: uniqueUsers.size };
  }, [recipes]);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this recipe? It will immediately go public.')) return;
    setIsSubmitting(true);
    try {
      await API.patch(`/recipes/${id}/review`, { status: 'approved' });
      toast.success('Recipe approved successfully!');
      fetchRecipes();
      if (selectedRecipe?._id === id) setSelectedRecipe(null);
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
    if (!rejectReason.trim()) return toast.warning('Please enter a rejection reason.');
    setIsSubmitting(true);
    try {
      await API.patch(`/recipes/${recipeToReject._id}/review`, { status: 'rejected', reason: rejectReason });
      toast.error('Recipe rejected.');
      setShowRejectModal(false);
      setRecipeToReject(null);
      fetchRecipes();
      if (selectedRecipe?._id === recipeToReject._id) setSelectedRecipe(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this recipe? This cannot be undone.')) return;
    try {
      await API.delete(`/recipes/${id}`);
      toast.success('Recipe deleted permanently.');
      fetchRecipes();
      if (selectedRecipe?._id === id) setSelectedRecipe(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  const filteredList = useMemo(() => {
    return recipes.filter(r => r.status === activeTab);
  }, [recipes, activeTab]);

  const TABS = ['pending', 'approved', 'rejected', 'contributors'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3">
              <ShieldAlert className="text-orange-500" /> Admin Control Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Review, approve, and manage site-wide recipe submissions.</p>
          </div>
          <button
            onClick={() => { fetchRecipes(); if (activeTab === 'contributors') fetchContributors(); }}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-sm font-semibold transition-all"
          >
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Total', value: stats.total, icon: <BarChart3 size={18} />, color: 'text-slate-400' },
            { label: 'Pending', value: stats.pending, icon: <Clock size={18} />, color: 'text-amber-400', border: 'border-l-amber-500' },
            { label: 'Approved', value: stats.approved, icon: <Check size={18} />, color: 'text-green-400', border: 'border-l-green-500' },
            { label: 'Rejected', value: stats.rejected, icon: <X size={18} />, color: 'text-red-400', border: 'border-l-red-500' },
            { label: 'Cooks', value: stats.totalContributors, icon: <ChefHat size={18} />, color: 'text-orange-400', border: 'border-l-orange-500', span: 'col-span-2 md:col-span-1' },
          ].map(({ label, value, icon, color, border, span }) => (
            <div key={label} className={`bg-slate-900/60 border border-slate-800 p-5 rounded-2xl ${border ? `border-l-4 ${border}` : ''} ${span || ''}`}>
              <div className={`flex items-center justify-between mb-2 ${color}`}>{icon} <span className="text-xs font-bold">{label}</span></div>
              <div className="text-3xl font-black text-white">{value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 mb-8 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedRecipe(null); }}
              className={`flex-1 min-w-max py-2.5 px-3 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'contributors' && <Users size={13} />}
              {tab === 'contributors' ? 'Cooks/Contributors' : `${tab} (${recipes.filter(r => r.status === tab).length})`}
            </button>
          ))}
        </div>

        {/* CONTRIBUTORS TAB */}
        {activeTab === 'contributors' ? (
          <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {contributorsLoading ? (
              <div className="py-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : contributors.length > 0 ? (
              <>
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 bg-slate-900/80 border-b border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span className="col-span-2">Cook / Contributor</span>
                  <span>Role</span>
                  <span>Recipes</span>
                  <span>Joined</span>
                  <span>Latest Recipe</span>
                </div>
                <div className="divide-y divide-slate-800/60">
                  {contributors.map((cook, idx) => (
                    <div key={cook._id} className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-800/20 transition-colors">
                      {/* Name + Email */}
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md">
                          {cook.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{cook.name}</p>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                            <Mail size={10} /> {cook.email}
                          </p>
                        </div>
                        {idx === 0 && (
                          <span className="ml-auto shrink-0 px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full text-[9px] font-black uppercase flex items-center gap-0.5">
                            <Star size={9} /> Top
                          </span>
                        )}
                      </div>
                      {/* Role */}
                      <div className="flex md:items-center">
                        <span className="text-xs text-slate-400 md:hidden font-bold uppercase mr-2">Role:</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          cook.role === 'admin'
                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {cook.role}
                        </span>
                      </div>
                      {/* Recipe count */}
                      <div className="flex md:items-center gap-1">
                        <span className="text-xs text-slate-400 md:hidden font-bold uppercase mr-2">Recipes:</span>
                        <span className="text-lg font-black text-white">{cook.recipeCount}</span>
                        <ChefHat size={12} className="text-orange-400 mt-0.5" />
                      </div>
                      {/* Joined */}
                      <div className="flex md:items-center gap-1.5 text-xs text-slate-400">
                        <span className="text-slate-500 md:hidden font-bold uppercase">Joined: </span>
                        <Calendar size={11} className="hidden md:block shrink-0" />
                        {cook.createdAt ? new Date(cook.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </div>
                      {/* Latest */}
                      <div className="flex md:items-center gap-1.5 text-xs text-slate-400">
                        <span className="text-slate-500 md:hidden font-bold uppercase">Latest: </span>
                        <Award size={11} className="hidden md:block shrink-0 text-orange-400" />
                        {cook.latestRecipeDate ? new Date(cook.latestRecipeDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <Users className="mx-auto text-slate-600 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-400">No contributors found</h3>
                <p className="text-xs text-slate-600 mt-1">Users with cook or admin roles will appear here.</p>
              </div>
            )}
          </div>
        ) : (
          /* RECIPE REVIEW TABS */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <div className="py-20 flex justify-center">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
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
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-16 h-16 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop'; }}
                          />
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-white truncate">{recipe.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                              {recipe.origin} · {recipe.user?.name || 'Seeded System'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                          <button onClick={() => setSelectedRecipe(recipe)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg" title="Inspect">
                            <Eye size={14} />
                          </button>
                          {recipe.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(recipe._id)} disabled={isSubmitting} className="p-2 bg-green-500/20 hover:bg-green-600 text-green-400 hover:text-white rounded-lg disabled:opacity-50" title="Approve">
                                <Check size={14} />
                              </button>
                              <button onClick={() => handleRejectClick(recipe)} disabled={isSubmitting} className="p-2 bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg disabled:opacity-50" title="Reject">
                                <X size={14} />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDelete(recipe._id)} className="p-2 bg-red-500/10 hover:bg-red-600/30 text-red-400 rounded-lg" title="Delete">
                            <Trash2 size={14} />
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

            {/* Details Panel */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl h-fit">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText size={18} className="text-orange-500" /> Detail Inspector
              </h2>

              {selectedRecipe ? (
                <div className="space-y-5">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.name}
                    className="w-full h-44 object-cover rounded-xl border border-slate-800 bg-slate-800 shadow"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop'; }}
                  />
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedRecipe.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRecipe.category && (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-[10px] font-bold">{selectedRecipe.category}</span>
                      )}
                      {selectedRecipe.origin && (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-[10px] font-bold">📍 {selectedRecipe.origin}</span>
                      )}
                      {selectedRecipe.difficulty && (
                        <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-full text-[10px] font-bold">{selectedRecipe.difficulty}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Submitted By</h4>
                    <p className="text-sm text-slate-300 font-semibold">{selectedRecipe.user?.name || 'Seeded'}</p>
                    <p className="text-xs text-slate-500">{selectedRecipe.user?.email || 'N/A'}</p>
                  </div>

                  {selectedRecipe.status === 'rejected' && (
                    <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-xs">
                      <span className="font-bold">Rejection Reason:</span> {selectedRecipe.rejectionReason}
                    </div>
                  )}

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Ingredients</h4>
                    {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                      <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-300">
                        {selectedRecipe.ingredients.map((ing, idx) => (
                          <li key={idx}>
                            {typeof ing === 'object' ? `${ing.name}${ing.quantity ? ' — ' + ing.quantity : ''}` : ing}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-600">No ingredients specified.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Steps</h4>
                    <ol className="space-y-2">
                      {selectedRecipe.procedure?.map((step, idx) => (
                        <li key={idx} className="flex gap-2 text-xs">
                          <span className="text-orange-500 font-bold shrink-0">{idx + 1}.</span>
                          <span className="text-slate-300 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {selectedRecipe.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => handleApprove(selectedRecipe._id)}
                        disabled={isSubmitting}
                        className="py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 text-sm"
                      >
                        <Check size={15} /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectClick(selectedRecipe)}
                        disabled={isSubmitting}
                        className="py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 text-sm"
                      >
                        <X size={15} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-600 text-xs">
                  Select a recipe from the list to inspect full details.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-slate-900 rounded-3xl border border-slate-800 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <AlertCircle size={20} className="text-red-500" /> Reject Submission
            </h3>
            <p className="text-xs text-slate-500 mb-5">Explain to the cook why this recipe cannot be accepted.</p>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows="4"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Missing measurements, blurry image, unclear instructions..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-red-500/50 outline-none transition-all text-sm resize-none"
              />
              <div className="flex gap-4 justify-end">
                <button type="button" onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold disabled:opacity-50">
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
