import React, { useState } from 'react';
import { X, Send, ArrowRightLeft, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Book } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface RequestModalProps {
  book: Book;
  onClose: () => void;
  onSuccess: () => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({ book, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [requestType, setRequestType] = useState<'Purchase' | 'Exchange'>(
    book.transactionType === 'Exchange' ? 'Exchange' : 'Purchase'
  );
  const [offeredBookOrCash, setOfferedBookOrCash] = useState('');
  const [message, setMessage] = useState(
    book.transactionType === 'Exchange'
      ? `Hi ${book.sellerName}, I would love to exchange one of my textbooks for "${book.title}". Are you free to meet on campus?`
      : `Hi ${book.sellerName}, I am interested in purchasing "${book.title}" for ₹${book.price}. Can we meet to inspect and complete the handover?`
  );
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide a short note to the seller.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createRequest({
        bookId: book.id,
        requestType,
        offeredBookOrCash: offeredBookOrCash.trim() || undefined,
        message: message.trim(),
        contactPhone: phone.trim() || undefined
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Request Sent!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              {book.sellerName} has received your {requestType.toLowerCase()} proposal. You can
              track this in your Student Dashboard.
            </p>
          </div>
        ) : (
          <div>
            <div className="border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Contact Seller — {book.sellerName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-medium">
                Book: {book.title} ({book.condition})
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher if book allows Both */}
              {book.transactionType === 'Both' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Proposal Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRequestType('Purchase');
                        setMessage(
                          `Hi ${book.sellerName}, I would like to buy "${book.title}" for ₹${book.price}.`
                        );
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                        requestType === 'Purchase'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Buy for ₹{book.price}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRequestType('Exchange');
                        setMessage(
                          `Hi ${book.sellerName}, I have a textbook to swap for "${book.title}".`
                        );
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                        requestType === 'Exchange'
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      Propose Book Swap
                    </button>
                  </div>
                </div>
              )}

              {/* In exchange: what book are you offering */}
              {requestType === 'Exchange' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Textbook or Course Material You are Offering
                  </label>
                  <input
                    type="text"
                    value={offeredBookOrCash}
                    onChange={(e) => setOfferedBookOrCash(e.target.value)}
                    placeholder="e.g. Silberschatz Operating Systems (9th Edition, Good)"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                  {book.preferredExchange && (
                    <p className="mt-1 text-[11px] text-teal-700 font-medium">
                      Seller preference: {book.preferredExchange}
                    </p>
                  )}
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Preferred Meeting Spot
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Where would you like to meet? (Campus library, cafeteria, student hostel...)"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Contact Phone / WhatsApp (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Sending Request...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
