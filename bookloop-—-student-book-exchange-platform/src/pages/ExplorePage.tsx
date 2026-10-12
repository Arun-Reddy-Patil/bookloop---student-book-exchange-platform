import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  FilterX
} from 'lucide-react';
import { Book } from '../types';
import { api } from '../services/api';
import { BookCard } from '../components/BookCard';
import { BOOK_CATEGORIES, BOOK_CONDITIONS } from '../../server/models/Book';

interface ExplorePageProps {
  initialSearch?: string;
  initialTransactionType?: string;
  onSelectBook: (book: Book) => void;
}

const CITIES = ['All', 'Bengaluru', 'New Delhi', 'Hyderabad', 'Mumbai', 'Chennai', 'Pune', 'Kolkata'];

export const ExplorePage: React.FC<ExplorePageProps> = ({
  initialSearch = '',
  initialTransactionType = 'All',
  onSelectBook
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [transactionType, setTransactionType] = useState(initialTransactionType);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [city, setCity] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync initial props
  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    if (initialTransactionType) setTransactionType(initialTransactionType);
  }, [initialTransactionType]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.getBooks({
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        condition: condition !== 'All' ? condition : undefined,
        transactionType: transactionType !== 'All' ? transactionType : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        city: city !== 'All' ? city : undefined,
        sort,
        page,
        limit: 9
      });

      setBooks(res.books);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching marketplace books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [category, condition, transactionType, city, sort, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setCondition('All');
    setTransactionType('All');
    setMinPrice('');
    setMaxPrice('');
    setCity('All');
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    category !== 'All' ||
    condition !== 'All' ||
    transactionType !== 'All' ||
    minPrice ||
    maxPrice ||
    city !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {transactionType === 'Exchange' ? 'Book Exchange Hub' : 'Explore Academic Textbooks'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified listings from students across college departments and campuses.
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Sort By:</label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters & Books Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, author, ISBN..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </form>

          {/* Transaction Type Segmented Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Listing Type</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              {(['All', 'Sell', 'Exchange'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTransactionType(t);
                    setPage(1);
                  }}
                  className={`py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    transactionType === t
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'All' ? 'All' : t === 'Sell' ? 'Sale' : 'Swap'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown/Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Academic Subject</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Disciplines</option>
              {BOOK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Book Condition</label>
            <select
              value={condition}
              onChange={(e) => {
                setCondition(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">Any Condition</option>
              {BOOK_CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* City / Campus Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Campus Location</label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Locations' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          {transactionType !== 'Exchange' && (
            <form onSubmit={handlePriceApply} className="space-y-2 pt-1 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700">Price Range (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min ₹"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max ₹"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Apply Range
              </button>
            </form>
          )}
        </aside>

        {/* Book Results Grid */}
        <main className="lg:col-span-3 space-y-6">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900">{books.length}</strong> of{' '}
              <strong className="text-slate-900">{total}</strong> textbooks available
            </span>
            {hasActiveFilters && (
              <span className="text-teal-700 font-medium">Filtered results</span>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse h-96">
                  <div className="bg-slate-200 h-52 rounded-lg mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-4" />
                  <div className="h-8 bg-slate-200 rounded mt-auto" />
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FilterX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Textbooks Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn&apos;t find any books matching your current filters. Try relaxing the search
                query or clearing filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} onSelect={onSelectBook} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                disabled={page <= 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 150, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="text-xs text-slate-600 font-medium">
                Page <span className="font-bold text-slate-900">{page}</span> of{' '}
                <span className="font-bold text-slate-900">{totalPages}</span>
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 150, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
