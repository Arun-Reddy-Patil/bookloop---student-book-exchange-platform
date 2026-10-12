import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRightLeft,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookCover } from '../components/BookCover';
import { BOOK_CATEGORIES, BOOK_CONDITIONS, TRANSACTION_TYPES } from '../../server/models/Book';

interface SellBookPageProps {
  onSuccess: (bookId: string) => void;
  onOpenLogin: () => void;
}

export const SellBookPage: React.FC<SellBookPageProps> = ({ onSuccess, onOpenLogin }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState<string>(BOOK_CATEGORIES[0]);
  const [edition, setEdition] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<any>('Good');
  const [transactionType, setTransactionType] = useState<any>('Both');
  const [price, setPrice] = useState('');
  const [preferredExchange, setPreferredExchange] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverPalette, setCoverPalette] = useState('teal');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [locality, setLocality] = useState('Campus Library / Main Quad');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to List a Book</h2>
        <p className="text-xs text-slate-500">
          BookLoop requires student authentication to ensure legitimate peer exchanges on campus.
        </p>
        <button
          onClick={onOpenLogin}
          className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Log In or Register
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (!title.trim() || !author.trim() || !description.trim() || !city.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (transactionType !== 'Exchange') {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        setError('Please specify a valid price in INR.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await api.createBook({
        title,
        author,
        isbn: isbn.trim() || undefined,
        category,
        edition: edition.trim() || undefined,
        description,
        condition,
        transactionType,
        price: transactionType === 'Exchange' ? 0 : Number(price),
        preferredExchange: preferredExchange.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
        coverPalette,
        city,
        locality
      });

      setSuccessMsg('Your book has been listed successfully!');
      setTimeout(() => {
        onSuccess(res.book.id);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to list book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          List an Academic Textbook
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Post syllabus books for sale, exchange, or both to students in your college community.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Book Essentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600" />
            1. Book Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Book Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Algorithms"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Author(s) *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Thomas H. Cormen, Charles E. Leiserson"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject / Academic Faculty *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                {BOOK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Edition (Optional)
              </label>
              <input
                type="text"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="e.g. 3rd Edition / South Asia Edition"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ISBN (Optional)
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="e.g. 978-0262033848"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Physical Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                {BOOK_CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c} (
                    {c === 'Like New'
                      ? 'No marks, clean pages'
                      : c === 'Good'
                      ? 'Minor highlighting, intact binding'
                      : c === 'Fair'
                      ? 'Notes present, shelf wear'
                      : 'Heavy use, intact text'}
                    )
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Notes *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe book highlights, included supplementary materials, and coursework relevance..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        {/* Step 2: Transaction & Pricing */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-teal-600" />
            2. Transaction & Value
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {TRANSACTION_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTransactionType(t)}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between cursor-pointer ${
                  transactionType === t
                    ? 'border-teal-600 bg-teal-50/60 text-teal-900 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm">{t === 'Both' ? 'Both (Sell or Swap)' : t}</span>
                <span className="text-[10px] text-slate-500 font-normal mt-1">
                  {t === 'Sell'
                    ? 'Student pays via cash/UPI'
                    : t === 'Exchange'
                    ? 'Student offers textbook in swap'
                    : 'Open to either cash or textbook swap'}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {transactionType !== 'Exchange' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selling Price (₹ INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="450"
                    className="w-full text-xs pl-7 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
            )}

            {(transactionType === 'Exchange' || transactionType === 'Both') && (
              <div className={transactionType === 'Exchange' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Exchange Book(s) or Topics
                </label>
                <input
                  type="text"
                  value={preferredExchange}
                  onChange={(e) => setPreferredExchange(e.target.value)}
                  placeholder="e.g. Silberschatz Operating Systems or Computer Networks"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Visual Jacket Design / Cover */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-teal-600" />
            3. Book Cover Appearance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Style & Palette
                </label>
                <div className="flex flex-wrap gap-2">
                  {['navy', 'teal', 'emerald', 'indigo', 'slate', 'sky', 'amber'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCoverPalette(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer ${
                        coverPalette === p
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Cover Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  If left blank, BookLoop automatically renders a crisp collegiate textbook jacket.
                </p>
              </div>
            </div>

            {/* Live Preview Container */}
            <div className="md:col-span-5 flex flex-col items-center">
              <span className="text-[11px] font-bold uppercase text-slate-400 mb-2">
                Live Listing Jacket Preview
              </span>
              <div className="w-44 aspect-[3/4]">
                <BookCover
                  title={title || 'Introduction to Algorithms'}
                  author={author || 'Thomas H. Cormen'}
                  category={category}
                  edition={edition || 'Academic Edition'}
                  coverImage={coverImage}
                  palette={coverPalette}
                  className="w-full h-full shadow-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Campus Location Handover */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            4. Handover & Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Hub *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru, New Delhi, Hyderabad"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus Locality / Preferred Spot *
              </label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Central Library, North Campus"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing Listing...' : 'Publish Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
