import React, { useState } from 'react';
import { BookOpen, Menu, X, User as UserIcon, PlusCircle, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenLogin,
  onOpenRegister
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-teal-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-950 font-sans leading-none">
                Book<span className="text-teal-600">Loop</span>
              </span>
              <span className="text-[10px] text-slate-600 font-medium tracking-wide">
                Student Exchange
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('home')}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-slate-900 ${
                currentTab === 'home' ? 'text-teal-600 font-semibold border-b-2 border-teal-600 pb-0.5' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('explore')}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-slate-900 ${
                currentTab === 'explore' ? 'text-teal-600 font-semibold border-b-2 border-teal-600 pb-0.5' : ''
              }`}
            >
              Explore Books
            </button>
            <button
              onClick={() => handleNav('exchange')}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-slate-900 ${
                currentTab === 'exchange' ? 'text-teal-600 font-semibold border-b-2 border-teal-600 pb-0.5' : ''
              }`}
            >
              Exchange Books
            </button>
            <button
              onClick={() => {
                if (!user) {
                  onOpenLogin();
                } else {
                  handleNav('sell');
                }
              }}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-slate-900 ${
                currentTab === 'sell' ? 'text-teal-600 font-semibold border-b-2 border-teal-600 pb-0.5' : ''
              }`}
            >
              Sell a Book
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-slate-900 ${
                currentTab === 'about' ? 'text-teal-600 font-semibold border-b-2 border-teal-600 pb-0.5' : ''
              }`}
            >
              About Us
            </button>
          </nav>

          {/* Zone 3: Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {user.role === 'admin' ? 'Admin' : 'Student'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <p className="text-[10px] text-teal-700 font-medium mt-0.5 truncate">{user.college}</p>
                    </div>

                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                      Student Dashboard
                    </button>

                    <button
                      onClick={() => handleNav('sell')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                      List a New Book
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5 text-indigo-600" />
                        Admin Moderation Panel
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        handleNav('home');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('explore')}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            Explore Books
          </button>
          <button
            onClick={() => handleNav('exchange')}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            Exchange Books
          </button>
          <button
            onClick={() => {
              if (!user) onOpenLogin();
              else handleNav('sell');
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            Sell a Book
          </button>
          <button
            onClick={() => handleNav('about')}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            About Us
          </button>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 bg-slate-50 rounded-lg mb-2">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.college}</p>
                </div>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg text-slate-800 hover:bg-slate-100"
                >
                  Student Dashboard
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNav('admin')}
                    className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg text-indigo-700 hover:bg-indigo-50"
                  >
                    Admin Moderation Panel
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    handleNav('home');
                  }}
                  className="w-full text-left py-2 px-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full py-2 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full py-2 text-center text-sm font-semibold text-white bg-teal-600 rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
