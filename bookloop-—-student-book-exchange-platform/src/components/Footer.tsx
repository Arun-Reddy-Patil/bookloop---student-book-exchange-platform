import React from 'react';
import { BookOpen, ShieldCheck, HeartHandshake, Sparkles, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Book<span className="text-teal-400">Loop</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering college students to buy, sell, and exchange academic textbooks safely,
              affordably, and sustainably on campuses across India.
            </p>
            <div className="flex items-center gap-3 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Campus Verified Student Network</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Explore All Textbooks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('exchange')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Book Exchange Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sell')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  List a Book for Sale
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Student Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Student Help & Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company & Help
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  About BookLoop
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  How Safe Exchange Works
                </a>
              </li>
            </ul>
          </div>

          {/* Campus Sustainability Commitment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Student Community
            </h4>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
                <HeartHandshake className="w-4 h-4" />
                <span>Zero Waste Education</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Every reused book saves up to 2.5 kg of CO₂ and keeps hundreds of rupees in a student’s pocket.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>help@bookloop.edu</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BookLoop Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Campus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
