import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { SellBookPage } from './pages/SellBookPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { Book } from './types';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchFromHome = (query: string) => {
    setSearchQuery(query);
    setCurrentTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={navigateTo}
        onOpenLogin={() => navigateTo('login')}
        onOpenRegister={() => navigateTo('register')}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectBook={handleSelectBook}
            onSearchQuery={handleSearchFromHome}
          />
        )}

        {currentTab === 'explore' && (
          <ExplorePage
            initialSearch={searchQuery}
            initialTransactionType="All"
            onSelectBook={handleSelectBook}
          />
        )}

        {currentTab === 'exchange' && (
          <ExplorePage
            initialSearch=""
            initialTransactionType="Exchange"
            onSelectBook={handleSelectBook}
          />
        )}

        {currentTab === 'sell' && (
          <SellBookPage
            onSuccess={(_bookId) => {
              navigateTo('dashboard');
            }}
            onOpenLogin={() => navigateTo('login')}
          />
        )}

        {currentTab === 'details' && selectedBook && (
          <BookDetailsPage
            book={selectedBook}
            onBack={() => navigateTo('explore')}
            onOpenLogin={() => navigateTo('login')}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onSwitchToRegister={() => navigateTo('register')}
            onSuccess={() => navigateTo('dashboard')}
          />
        )}

        {currentTab === 'register' && (
          <RegisterPage
            onSwitchToLogin={() => navigateTo('login')}
            onSuccess={() => navigateTo('dashboard')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onNavigateToSell={() => navigateTo('sell')}
            onSelectBook={handleSelectBook}
          />
        )}

        {currentTab === 'admin' && <AdminPage />}

        {currentTab === 'about' && <AboutPage />}

        {currentTab === 'contact' && <ContactPage />}

        {currentTab === 'faq' && <FaqPage />}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
