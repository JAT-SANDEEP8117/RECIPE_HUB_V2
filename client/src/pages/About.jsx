import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Cpu, Database, CloudLightning, ShieldCheck, Mail, Bot, BookOpen, Layers } from 'lucide-react';

const About = () => {
  const techStack = [
    {
      category: 'Frontend Core',
      icon: <Layers className="text-orange-500" size={32} />,
      items: ['React (v19) - Dynamic UI rendering', 'Vite - Lightning fast build tooling', 'Tailwind CSS (v4) - Sleek modern styling', 'Lucide React - Premium clean icons']
    },
    {
      category: 'Backend Core',
      icon: <Cpu className="text-amber-500" size={32} />,
      items: ['Node.js - Scalable JS runtime', 'Express.js - REST API routing', 'JWT - Secure role-based tokens', 'Bcrypt.js - Hashed password protection']
    },
    {
      category: 'Database isolated',
      icon: <Database className="text-emerald-500" size={32} />,
      items: ['MongoDB Atlas - Cloud cluster database', 'Isolated "recipehub" DB - No cross-db leaks', 'Mongoose - Modeling & strict validation schemas']
    },
    {
      category: 'Cloud Services',
      icon: <CloudLightning className="text-blue-500" size={32} />,
      items: ['Cloudinary API - Recipe image cloud storage', 'On-failure rollback - Image cleanup security', 'Multer integration - Multi-part file stream']
    },
    {
      category: 'AI Assistant',
      icon: <Bot className="text-purple-500" size={32} />,
      items: ['Groq SDK - Ultra-low latency Llama-3 model', 'Database-Aware context - Real recipe matches', 'Input validation - Length-limiting and sanitation']
    },
    {
      category: 'Notifications',
      icon: <Mail className="text-pink-500" size={32} />,
      items: ['Nodemailer - SMTP automation', 'Admin notification emails - HTML layouts', 'Graceful SMTP fallback - Database-safe alerts']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              About <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">RecipeHub V2</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
              A secure, database-driven, and AI-powered cooking companion. Explore, submit, and chat about global recipes.
            </p>
          </div>

          {/* Core Info */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 mb-12 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="text-orange-500" /> Our Architecture
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm">
              RecipeHub V2 is designed as a highly secure role-based application for visitors, cooks, and admins. 
              It provides a seamless workflow from local development configurations to production deployment. 
              The backend ensures isolated database transactions, Cloudinary file uploads, Nodemailer review triggers, and strict authorization gates.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm">
              With our custom Groq AI Integration, users can consult our database-aware assistant for recipe suggestions 
              that correspond to the actual available menu items.
            </p>
          </div>

          {/* Tech Cards Grid */}
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Layers className="text-orange-500" /> Tech Stack & APIs Used
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {techStack.map((tech, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  {tech.icon}
                  <h3 className="text-xl font-bold text-white">{tech.category}</h3>
                </div>
                <ul className="space-y-2 text-slate-400 text-sm">
                  {tech.items.map((item, i_idx) => (
                    <li key={i_idx} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Dev Note */}
          <div className="text-center p-8 bg-slate-900/20 border border-slate-800 rounded-3xl">
            <BookOpen className="mx-auto text-slate-500 mb-3" size={28} />
            <h3 className="text-white font-semibold mb-1">Looking for setup details?</h3>
            <p className="text-slate-500 text-xs mb-4">Read our markdown manuals to learn how to seed and configure credentials.</p>
            <span className="text-orange-500 text-sm font-bold">README.md • SETUP_GUIDE.md • PROJECT_DOCUMENTATION.md</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
