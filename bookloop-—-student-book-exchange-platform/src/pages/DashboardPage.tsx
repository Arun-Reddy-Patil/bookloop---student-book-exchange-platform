import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  Trash2,
  Edit3,
  PlusCircle,
  User,
  Inbox,
  Send,
  Check,
  X,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { Book, ExchangeRequest } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookCover } from '../components/BookCover';

interface DashboardPageProps {
  onNavigateToSell: () => void;
  onSelectBook: (book: Book) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToSell,
  onSelectBook
}) => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'received' | 'sent' | 'profile'>('listings');

  const [myListings, setMyListings] = useState<Book[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ExchangeRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [course, setCourse] = useState(user?.course || '');
  const [city, setCity] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileSaving, setProfileSaving] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [listingsRes, receivedRes, sentRes] = await Promise.all([
        api.getMyListings(),
        api.getReceivedRequests(),
        api.getSentRequests()
      ]);
      setMyListings(listingsRes.books);
      setReceivedRequests(receivedRes.requests);
      setSentRequests(sentRes.requests);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteListing = async (bookId: string) => {
    if (!confirm('Are you sure you want to remove this book listing?')) return;
    try {
      await api.deleteBook(bookId);
      setActionMsg('Book listing removed successfully.');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing.');
    }
  };

  const handleUpdateRequestStatus = async (
    reqId: string,
    status: 'Accepted' | 'Rejected' | 'Cancelled' | 'Completed'
  ) => {
    try {
      await api.updateRequestStatus(reqId, status);
      setActionMsg(`Request marked as ${status}.`);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update request.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await api.updateProfile({
        name,
        college,
        course,
        city,
        phone,
        bio
      });
      updateUser(res.user);
      setActionMsg('Profile updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Error updating profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  if (!user) return null;

  const totalListings = myListings.length;
  const availableBooks = myListings.filter((b) => b.status === 'Available').length;
  const pendingRequests = receivedRequests.filter((r) => r.status === 'Pending').length;
  const completedTransactions = [
    ...receivedRequests.filter((r) => r.status === 'Completed'),
    ...sentRequests.filter((r) => r.status === 'Completed')
  ].length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
              {user.role === 'admin' ? 'Campus Administrator' : 'Verified Student'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {user.college} · {user.course}
          </p>
        </div>

        <button
          onClick={onNavigateToSell}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Listings</span>
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {totalListings}
          </div>
          <p className="text-[11px] text-slate-400">Textbooks posted</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Available Now</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">
            {availableBooks}
          </div>
          <p className="text-[11px] text-slate-400">Ready for exchange/sale</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Proposals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 tabular-nums">
            {pendingRequests}
          </div>
          <p className="text-[11px] text-slate-400">Incoming to review</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Completed Deals</span>
            <ArrowRightLeft className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-sky-700 tabular-nums">
            {completedTransactions}
          </div>
          <p className="text-[11px] text-slate-400">Handovers finished</p>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMsg && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="font-bold text-teal-700">
            Dismiss
          </button>
        </div>
      )}

      {/* Segmented Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'listings'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Listings ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'received'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Requests Received ({receivedRequests.length})
          {pendingRequests > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-teal-500 text-slate-950 rounded-full text-[10px]">
              {pendingRequests}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'sent'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Requests Sent ({sentRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Profile Settings
        </button>
      </div>

      {/* Tab 1: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Textbooks You Listed</h2>
            <button
              onClick={onNavigateToSell}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Another Book</span>
            </button>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">Loading listings...</p>
          ) : myListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">You haven&apos;t listed any textbooks yet</p>
              <p className="text-xs text-slate-500">
                Help fellow students and free up shelf space by listing your old books.
              </p>
              <button
                onClick={onNavigateToSell}
                className="mt-2 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg"
              >
                List Your First Book
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-16 aspect-[3/4] shrink-0">
                      <BookCover
                        title={book.title}
                        author={book.author}
                        category={book.category}
                        edition={book.edition}
                        palette={book.coverPalette}
                        className="w-full h-full text-[8px]"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <span>{book.category}</span>
                        <span>·</span>
                        <span>{book.condition}</span>
                        <span>·</span>
                        <span
                          className={`font-semibold ${
                            book.status === 'Available'
                              ? 'text-emerald-700'
                              : book.status === 'Pending'
                              ? 'text-amber-700'
                              : 'text-slate-500'
                          }`}
                        >
                          {book.status}
                        </span>
                      </div>
                      <h3
                        onClick={() => onSelectBook(book)}
                        className="font-bold text-slate-900 text-sm truncate hover:text-teal-700 cursor-pointer"
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {book.transactionType === 'Exchange'
                          ? 'Exchange Only'
                          : `₹${book.price} ${book.transactionType === 'Both' ? '(or swap)' : ''}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectBook(book)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteListing(book.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Requests Received (as seller) */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Incoming Buyer / Exchange Proposals</h2>
          {receivedRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">No incoming proposals yet</p>
              <p className="text-xs text-slate-500">
                When students request your listed textbooks, proposals will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivedRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                        {req.requestType} Proposal
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{req.bookTitle}</h3>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md self-start sm:self-auto ${
                        req.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'Accepted'
                          ? 'bg-teal-100 text-teal-800'
                          : req.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Status: {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700 block">From Student:</span>
                      <p className="text-slate-900 font-bold">{req.buyerName}</p>
                      <p className="text-slate-500">{req.buyerCollege}</p>
                      <div className="mt-1 flex items-center gap-3 text-slate-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {req.buyerEmail}
                        </span>
                        {req.buyerPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {req.buyerPhone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block">Offer Details:</span>
                      {req.requestType === 'Exchange' ? (
                        <p className="text-teal-800 font-medium bg-teal-50 p-2 rounded-lg border border-teal-100">
                          Offering: {req.offeredBookOrCash}
                        </p>
                      ) : (
                        <p className="text-slate-900 font-semibold">
                          Agreed Cash / UPI Price: ₹{req.bookPrice}
                        </p>
                      )}
                      <p className="mt-2 text-slate-600 italic bg-slate-50 p-2 rounded-lg">
                        &quot;{req.message}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Actions according to status */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, 'Rejected')}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, 'Accepted')}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Accept Proposal
                        </button>
                      </>
                    )}

                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => handleUpdateRequestStatus(req.id, 'Completed')}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Mark Handover Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Requests Sent (as buyer) */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Proposals You Sent to Other Students</h2>
          {sentRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <Send className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">You haven&apos;t sent any requests yet</p>
              <p className="text-xs text-slate-500">
                Explore books in the marketplace to buy or propose a textbook exchange.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sentRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Target Book
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{req.bookTitle}</h3>
                      <p className="text-xs text-slate-500">Seller: {req.sellerName}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md self-start sm:self-auto ${
                        req.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'Accepted'
                          ? 'bg-teal-100 text-teal-800'
                          : req.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Status: {req.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-700">
                      <strong>Your Proposal:</strong>{' '}
                      {req.requestType === 'Exchange'
                        ? `Offered: ${req.offeredBookOrCash}`
                        : `Purchase price: ₹${req.bookPrice}`}
                    </p>
                    <p className="text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                      &quot;{req.message}&quot;
                    </p>
                  </div>

                  {req.status === 'Pending' && (
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleUpdateRequestStatus(req.id, 'Cancelled')}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 max-w-2xl space-y-6 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900">Your Student Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course / Department
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your academic interests, semester year, or exchange preferences..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {profileSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
