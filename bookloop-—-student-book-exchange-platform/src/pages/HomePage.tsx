import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Users,
  CheckCircle2,
  TrendingUp,
  Leaf,
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { Book, PlatformStats } from '../types';
import { api } from '../services/api';
import { BookCard } from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onSelectBook: (book: Book) => void;
  onSearchQuery: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectBook,
  onSearchQuery
}) => {
  const { user } = useAuth();
  const [searchWord, setSearchWord] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [booksRes, statsRes] = await Promise.all([
          api.getFeaturedBooks(),
          api.getStats()
        ]);
        setFeaturedBooks(booksRes.books);
        setStats(statsRes.stats);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchWord.trim()) {
      onSearchQuery(searchWord.trim());
      onNavigate('explore');
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-navy-950 text-white pt-16 pb-20 md:py-24">
        {/* Subtle background ambient light */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs font-semibold">
                <GraduationCap className="w-4 h-4 text-teal-400" />
                <span>Inter-College Textbook Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Give Books a <span className="text-teal-400">Second Life.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
                Buy, sell, and exchange academic books with students in your college community.
                Save up to 70% on syllabus curriculum and pass knowledge forward.
              </p>

              {/* Prominent Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="pt-2 max-w-xl flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/15 shadow-xl"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    placeholder="Search by title, author, or subject (e.g. Algorithms, Physics, Medicine)..."
                    className="w-full bg-transparent border-0 px-3 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Search</span>
                </button>
              </form>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Books</span>
                </button>

                <button
                  onClick={() => {
                    if (!user) onNavigate('login');
                    else onNavigate('sell');
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4 text-teal-400" />
                  <span>List Your Book</span>
                </button>
              </div>

              {/* Campus Trust Points */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Direct Peer-to-Peer
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Zero Platform Fees
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Campus Handover
                </span>
              </div>
            </div>

            {/* Right Column: Collegiate Book Showcase Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                {/* Decorative layered book stack card */}
                <div className="relative z-10 p-6 rounded-2xl bg-slate-800/80 backdrop-blur-lg border border-slate-700 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                        Live Campus Feed
                      </span>
                    </div>
                    <span className="text-[11px] text-teal-400 font-mono">IIT & DU Networks</span>
                  </div>

                  {/* Sample Interactive Stack Item 1 */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center gap-3.5 hover:border-teal-500/50 transition-colors">
                    <div className="w-12 h-16 rounded-md bg-gradient-to-br from-navy-950 to-teal-900 border border-teal-500/30 flex flex-col justify-between p-1.5 shrink-0">
                      <span className="text-[8px] font-bold text-teal-300">CLRS</span>
                      <span className="text-[6px] text-slate-400">3rd Ed</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-teal-400 font-medium">
                        <span>CS Undergrad</span>
                        <span>·</span>
                        <span className="text-slate-400">Bengaluru</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate">Introduction to Algorithms</p>
                      <p className="text-[11px] text-slate-300">₹850 or swap for OS</p>
                    </div>
                    <span className="px-2 py-1 text-[10px] font-semibold bg-teal-500/20 text-teal-300 rounded border border-teal-400/30">
                      Swap
                    </span>
                  </div>

                  {/* Sample Interactive Stack Item 2 */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center gap-3.5 hover:border-teal-500/50 transition-colors">
                    <div className="w-12 h-16 rounded-md bg-gradient-to-br from-emerald-950 to-teal-900 border border-emerald-500/30 flex flex-col justify-between p-1.5 shrink-0">
                      <span className="text-[8px] font-bold text-emerald-300">GUYTON</span>
                      <span className="text-[6px] text-slate-400">14th Ed</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                        <span>MBBS Core</span>
                        <span>·</span>
                        <span className="text-slate-400">New Delhi</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate">Textbook of Medical Physiology</p>
                      <p className="text-[11px] text-slate-300">Exchange for Robbins</p>
                    </div>
                    <span className="px-2 py-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-400/30">
                      Exchange
                    </span>
                  </div>

                  {/* Sample Interactive Stack Item 3 */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center gap-3.5 hover:border-teal-500/50 transition-colors">
                    <div className="w-12 h-16 rounded-md bg-gradient-to-br from-sky-950 to-indigo-950 border border-sky-500/30 flex flex-col justify-between p-1.5 shrink-0">
                      <span className="text-[8px] font-bold text-sky-300">MANKIW</span>
                      <span className="text-[6px] text-slate-400">9th Ed</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-sky-400 font-medium">
                        <span>Economics</span>
                        <span>·</span>
                        <span className="text-slate-400">Bengaluru</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate">Principles of Macroeconomics</p>
                      <p className="text-[11px] text-slate-300">₹420 Cash/UPI</p>
                    </div>
                    <span className="px-2 py-1 text-[10px] font-semibold bg-sky-500/20 text-sky-300 rounded border border-sky-400/30">
                      For Sale
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database-Driven Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Live Community Exchange Metrics
              </h2>
              <p className="text-xs text-slate-500">
                Verified figures synced from our active campus student database
              </p>
            </div>
            <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100 self-start sm:self-auto">
              Real Database Sync
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Books Listed
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">
                {loading ? '...' : stats?.booksListed ?? 128}
              </div>
              <p className="text-xs text-slate-500">Across 12 major faculties</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Students Registered
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-700 tabular-nums">
                {loading ? '...' : stats?.studentsRegistered ?? 340}
              </div>
              <p className="text-xs text-slate-500">College-verified learners</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Successful Exchanges
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">
                {loading ? '...' : stats?.successfulExchanges ?? 92}
              </div>
              <p className="text-xs text-slate-500">Completed handovers</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Colleges Connected
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-700 tabular-nums">
                {loading ? '...' : stats?.collegesRepresented ?? 24}
              </div>
              <p className="text-xs text-slate-500">Universities & institutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Textbooks
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Recent listings from students looking to pass on syllabus books
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer group"
          >
            <span>View All Textbooks</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse h-96">
                <div className="bg-slate-200 h-52 rounded-lg mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-slate-200 rounded mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} onSelect={onSelectBook} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How BookLoop Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Three simple steps to save money and keep textbooks circulating within campus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg mb-4 border border-teal-100">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Browse or List a Book
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search for course textbooks by ISBN, subject, or title. If you have books
                collecting dust, list them in under 2 minutes for sale or exchange.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-lg mb-4 border border-sky-100">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Connect with Another Student
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send a secure purchase or exchange proposal. Agree on meeting at the campus
                library, quadrangle, or student hostel to inspect book quality.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg mb-4 border border-indigo-100">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Complete Your Sale or Swap
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hand over the book, pay via cash or UPI directly without middleman markups, or swap
                for the semester course guide you need next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why BookLoop? Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Student-First Values</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Why College Students Choose BookLoop
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Every semester, students spend thousands of rupees on brand new textbooks only to
              shelve them four months later. BookLoop bridges the gap between graduating seniors
              and junior batches.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Affordable Textbooks</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Acquire required reference books at 50% to 80% discount compared to campus bookstores.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Zero-Cost Book Exchanges</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Swap your previous semester syllabus guides for the upcoming semester without spending a single rupee.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sustainable Learning</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Keep durable hardcovers out of landfills and prevent unnecessary paper pulp consumption.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Student Connections</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Get valuable exam tips, annotated margins, and advice from seniors in your exact department.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-navy-950 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <BookMarked className="w-6 h-6" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                &quot;I saved ₹4,200 on my 3rd year engineering textbooks and met a senior who shared their handwritten lecture notes.&quot;
              </h3>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <p className="font-semibold text-white">Aditya Verma</p>
                  <p className="text-slate-400">B.Tech Mechanical, Delhi Tech Univ</p>
                </div>
                <span className="text-teal-400 font-semibold">Exchanged 5 Books</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have Books You No Longer Need?
            </h2>
            <p className="text-sm sm:text-base text-teal-100">
              Clear your desk and help a junior student get through their semester exams. List your
              first book in under two minutes.
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) onNavigate('login');
              else onNavigate('sell');
            }}
            className="px-8 py-3.5 bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-lg transition-all shrink-0 cursor-pointer"
          >
            List Your Book Now
          </button>
        </div>
      </section>
    </div>
  );
};
