import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in: redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role authorization checks
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center bg-slate-900 p-10 rounded-3xl border border-slate-800 max-w-md shadow-xl">
          <ShieldAlert size={64} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-3xl font-black text-white mb-3">Access Denied</h2>
          <p className="text-slate-400 mb-8 text-sm">You do not have the required permissions to view this content.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all font-semibold"
          >
            <ArrowLeft size={16} /> Return Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
