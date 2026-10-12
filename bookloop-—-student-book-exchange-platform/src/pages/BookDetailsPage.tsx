import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  Eye,
  Flag,
  Send,
  ArrowRightLeft,
  CheckCircle,
  Tag,
  Share2,
  UserCheck
} from 'lucide-react';
import { Book } from '../types';
import { BookCover } from '../components/BookCover';
import { RequestModal } from '../components/RequestModal';
import { ReportModal } from '../components/ReportModal';
import { useAuth } from '../context/AuthContext';

interface BookDetailsPageProps {
  book: Book;
  onBack: () => void;
  onOpenLogin: () => void;
}

export const BookDetailsPage: React.FC<BookDetailsPageProps> = ({
  book,
  onBack,
  onOpenLogin
}) => {
  const { user } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner = user?.id === book.sellerId;
  const isAvailable = book.status === 'Available';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Listing'}</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Big Book Jacket Visual (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 p-6 md:p-8 flex items-center justify-center relative">
          <div className="w-full max-w-sm aspect-[3/4]">
            <BookCover
              title={book.title}
              author={book.author}
              category={book.category}
              edition={book.edition}
              coverImage={book.coverImage}
              palette={book.coverPalette}
              className="w-full h-full shadow-2xl"
              aspect="detail"
            />
          </div>
        </div>

        {/* Right Column: Contiguous Purchase / Exchange Module (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Metadata line without pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold">{book.category}</span>
              <span aria-hidden="true">·</span>
              <span>Condition: <strong>{book.condition}</strong></span>
              {book.edition && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{book.edition}</span>
                </>
              )}
              {book.isbn && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">ISBN: {book.isbn}</span>
                </>
              )}
            </div>

            {/* Title & Author */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {book.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                By {book.author}
              </p>
            </div>

            {/* Price & Transaction Badge */}
            <div className="pt-2 pb-4 border-b border-slate-100 flex flex-wrap items-baseline gap-4">
              {book.transactionType === 'Exchange' ? (
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    Available for Book Exchange Only
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-slate-500">₹</span>
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    {book.price}
                  </span>
                  {book.transactionType === 'Both' && (
                    <span className="text-xs text-slate-500 font-medium ml-2">
                      (or swap for preferred textbook)
                    </span>
                  )}
                </div>
              )}

              {/* Status Indicator */}
              <div className="ml-auto">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    book.status === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : book.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Status: {book.status}
                </span>
              </div>
            </div>

            {/* Exchange Preference callout if applicable */}
            {(book.transactionType === 'Exchange' || book.transactionType === 'Both') &&
              book.preferredExchange && (
                <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900">
                  <span className="font-bold block mb-0.5">Preferred Exchange In Mind:</span>
                  <p>{book.preferredExchange}</p>
                </div>
              )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Book Description & Notes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            {/* Seller Campus Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                  {book.sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {book.sellerName}
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  </h4>
                  <p className="text-[11px] text-slate-500">{book.sellerCollege}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {book.locality}, {book.city}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Listed {new Date(book.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{book.views} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area: Request / Disabled states */}
          <div className="pt-4 border-t border-slate-100">
            {isOwner ? (
              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 font-medium text-center">
                This is your own listing. You can manage or edit it in your Student Dashboard.
              </div>
            ) : !isAvailable ? (
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 font-medium text-center border border-amber-200">
                This listing is currently {book.status.toLowerCase()}. Check back later or browse
                other textbooks.
              </div>
            ) : !user ? (
              <div className="space-y-2 text-center">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Log in to Request this Book
                </button>
                <p className="text-[11px] text-slate-500">
                  Only verified student accounts can propose textbook exchanges.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(true)}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {book.transactionType === 'Exchange' ? (
                    <>
                      <ArrowRightLeft className="w-4 h-4" />
                      <span>Propose Book Exchange</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request to Buy (₹{book.price})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRequestModal && (
        <RequestModal
          book={book}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            // refresh or toast
          }}
        />
      )}

      {showReportModal && (
        <ReportModal book={book} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
};
