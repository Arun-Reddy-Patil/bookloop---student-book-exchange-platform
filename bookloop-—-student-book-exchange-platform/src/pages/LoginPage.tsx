import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = async () => {
    setEmail('arunreddy9973@gmail.com');
    setPassword('Student@123');
    setLoading(true);
    setError(null);
    try {
      await login({ email: 'arunreddy9973@gmail.com', password: 'Student@123' });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setEmail('admin@bookloop.edu');
    setPassword('Admin@123');
    setLoading(true);
    setError(null);
    try {
      await login({ email: 'admin@bookloop.edu', password: 'Admin@123' });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center mx-auto shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Book<span className="text-teal-600">Loop</span>
          </h1>
          <p className="text-xs text-slate-500">
            Log in to manage your textbooks and exchange proposals
          </p>
        </div>

        {/* Quick Demo Login Bar */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Instant Demo Logins</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoStudent}
              className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800 hover:border-teal-500 hover:text-teal-700 transition-colors shadow-2xs text-center cursor-pointer"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-indigo-700 hover:border-indigo-500 transition-colors shadow-2xs text-center cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. arunreddy9973@gmail.com"
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs px-3 py-2.5 pr-10 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-hidden"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Logging In...' : 'Log In to Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          <span>Don&apos;t have an account yet? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-teal-700 hover:underline cursor-pointer"
          >
            Sign up now
          </button>
        </div>
      </div>
    </div>
  );
};
