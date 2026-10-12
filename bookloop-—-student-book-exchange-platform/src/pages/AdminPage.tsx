import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  Flag,
  Mail,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { User, Book, Report, ContactMessage } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'books' | 'reports' | 'messages'>('overview');
  const [messageToast, setMessageToast] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes, booksRes, reportsRes, msgRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getBooks({ limit: 50 }),
        api.getAdminReports(),
        api.getAdminMessages()
      ]);

      setStats(overviewRes.stats);
      setUsersList(usersRes.users);
      setBooksList(booksRes.books);
      setReportsList(reportsRes.reports);
      setMessagesList(msgRes.messages);
    } catch (err) {
      console.error('Error loading admin panel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-rose-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500">
          This administration console requires verified moderator or administrator privileges.
        </p>
      </div>
    );
  }

  const handleToggleUserRole = async (targetUser: User) => {
    const newRole = targetUser.role === 'admin' ? 'student' : 'admin';
    if (!confirm(`Change role of ${targetUser.name} to ${newRole}?`)) return;

    try {
      await api.updateUserRole(targetUser.id, newRole);
      setMessageToast(`Updated role for ${targetUser.name} to ${newRole}`);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating role');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to remove this book listing as moderator?')) return;
    try {
      await api.deleteBook(bookId);
      setMessageToast('Listing removed.');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error deleting book');
    }
  };

  const handleUpdateReport = async (reportId: string, status: string) => {
    try {
      await api.updateReportStatus(reportId, status);
      setMessageToast(`Report status set to ${status}`);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating report');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Shield className="w-4 h-4" />
            <span>Master Moderation Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            BookLoop Governance
          </h1>
          <p className="text-xs text-slate-400">
            Moderate peer listings, audit reports, and maintain campus community trust.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {messageToast && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs flex items-center justify-between">
          <span>{messageToast}</span>
          <button onClick={() => setMessageToast(null)} className="font-bold text-teal-700">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Students & Users ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'books' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Listings ({booksList.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'reports' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Moderation Reports ({reportsList.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'messages' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Support Messages ({messagesList.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Total Registered Users</span>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {stats.totalUsers}
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Total Listings Posted</span>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {stats.totalListings}
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Available Books</span>
              <div className="text-2xl font-extrabold text-teal-700 tabular-nums">
                {stats.availableBooks}
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Completed Transactions</span>
              <div className="text-2xl font-extrabold text-indigo-700 tabular-nums">
                {stats.completedTransactions}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Recent Moderation Activity
            </h3>
            {reportsList.length === 0 ? (
              <p className="text-xs text-slate-500">No reported listings currently pending.</p>
            ) : (
              <div className="space-y-2">
                {reportsList.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{r.bookTitle}</span>
                      <span className="text-slate-500 ml-2">Reason: {r.reason}</span>
                    </div>
                    <span className="font-semibold text-rose-700">{r.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">College / University</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3.5">{u.email}</td>
                    <td className="p-3.5">{u.college}</td>
                    <td className="p-3.5">{u.city}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleToggleUserRole(u)}
                        className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
                      >
                        {u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Books */}
      {activeTab === 'books' && (
        <div className="space-y-3">
          {booksList.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-teal-700">
                  {book.category} · {book.condition}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{book.title}</h4>
                <p className="text-slate-500">
                  Seller: {book.sellerName} ({book.sellerCollege}) · {book.city}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">
                  {book.transactionType === 'Exchange' ? 'Exchange' : `₹${book.price}`}
                </span>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Remove from platform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {reportsList.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-xs text-slate-500">
              No reports filed. Platform is running clean.
            </div>
          ) : (
            reportsList.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900">{rep.bookTitle}</span>
                  </div>
                  <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    {rep.status}
                  </span>
                </div>
                <p className="text-slate-600">
                  <strong>Reason:</strong> {rep.reason}
                </p>
                {rep.details && <p className="text-slate-500 italic">&quot;{rep.details}&quot;</p>}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleUpdateReport(rep.id, 'Dismissed')}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-semibold"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleUpdateReport(rep.id, 'Actioned')}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 rounded text-white font-semibold"
                  >
                    Mark Actioned
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Messages */}
      {activeTab === 'messages' && (
        <div className="space-y-3">
          {messagesList.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-xs text-slate-500">
              No contact inquiries submitted.
            </div>
          ) : (
            messagesList.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{m.subject}</span>
                  <span className="text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600">
                  From: {m.name} ({m.email})
                </p>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg mt-1">{m.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
