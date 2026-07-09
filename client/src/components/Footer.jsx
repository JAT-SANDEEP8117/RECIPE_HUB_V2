import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Github, UtensilsCrossed, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import API from '../api/axiosInstance';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || newsletterStatus === 'loading' || newsletterStatus === 'success') return;

    setNewsletterStatus('loading');
    setErrorMsg('');
    try {
      await API.post('/newsletter/subscribe', { email: email.trim() });
      setNewsletterStatus('success');
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Subscription failed. Try again.';
      setErrorMsg(msg);
      setNewsletterStatus('error');
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Branding */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed size={20} className="text-orange-500" />
              <span className="text-white font-black text-lg bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                RecipeHub
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 mb-4 max-w-xs">
              Explore global culinary traditions and share your favorite recipes with our vibrant community.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Twitter" className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-orange-400 rounded-lg transition-all">
                <Twitter size={14} />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-orange-400 rounded-lg transition-all">
                <Instagram size={14} />
              </a>
              <a href="#" aria-label="Facebook" className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-orange-400 rounded-lg transition-all">
                <Facebook size={14} />
              </a>
              <a href="#" aria-label="GitHub" className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-orange-400 rounded-lg transition-all">
                <Github size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white hover:translate-x-0.5 inline-flex transition-all">
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link to="/add-recipe" className="hover:text-white inline-flex transition-all">
                  Share a Recipe
                </Link>
              </li>
              <li>
                <button
                  onClick={() => document.querySelector('[title="Open AI Assistant"]')?.click()}
                  className="hover:text-orange-400 inline-flex items-center gap-1 transition-all"
                >
                  Ask the Chatbot 🤖
                </button>
              </li>
              <li>
                <Link to="/login" className="hover:text-white inline-flex transition-all">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Explore</h4>
            <ul className="space-y-2 text-xs">
              {['Indian', 'Italian', 'Chinese', 'Mexican', 'French'].map(cuisine => (
                <li key={cuisine}>
                  <Link to={`/?cuisine=${cuisine}`} className="hover:text-white inline-flex transition-all">
                    {cuisine} Cuisine
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Stay Updated</h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Get weekly recipe picks & cooking tips straight to your inbox.
            </p>

            {newsletterStatus === 'success' ? (
              <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-800/50 rounded-xl text-green-400 text-xs">
                <CheckCircle size={14} className="shrink-0" />
                You're subscribed! 🎉
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setNewsletterStatus('idle'); setErrorMsg(''); }}
                    placeholder="your@email.com"
                    required
                    className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="shrink-0 p-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white rounded-lg transition-all active:scale-95"
                    title="Subscribe"
                  >
                    {newsletterStatus === 'loading'
                      ? <Loader2 size={14} className="animate-spin" />
                      : <ArrowRight size={14} />
                    }
                  </button>
                </div>
                {newsletterStatus === 'error' && (
                  <p className="text-[10px] text-red-400">{errorMsg}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-600">
          <p>© {new Date().getFullYear()} RecipeHub. Designed & Developed with ♥ by Jat Sandeep.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
