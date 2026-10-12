import React from 'react';
import { MapPin, ArrowRightLeft, Tag } from 'lucide-react';
import { Book } from '../types';
import { BookCover } from './BookCover';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect }) => {
  const isExchangeOnly = book.transactionType === 'Exchange';
  const isBoth = book.transactionType === 'Both';

  return (
    <div
      onClick={() => onSelect(book)}
      className="group relative bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1"
    >
      {/* Book Cover Area */}
      <div className="relative p-3 pb-0 bg-slate-50/60 aspect-[3/4] flex items-center justify-center">
        <BookCover
          title={book.title}
          author={book.author}
          category={book.category}
          edition={book.edition}
          coverImage={book.coverImage}
          palette={book.coverPalette}
          className="w-full h-full"
          aspect="card"
        />

        {/* Transaction Tag */}
        <div className="absolute top-5 right-5 z-20">
          {isExchangeOnly ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white shadow-xs">
              <ArrowRightLeft className="w-3 h-3" />
              For Exchange
            </span>
          ) : isBoth ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-600 text-white shadow-xs">
              <Tag className="w-3 h-3" />
              Buy / Swap
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900 text-white shadow-xs">
              For Sale
            </span>
          )}
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line without pills */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
            <span>{book.category}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                book.condition === 'Like New'
                  ? 'text-teal-700 font-semibold'
                  : book.condition === 'Good'
                  ? 'text-slate-700'
                  : 'text-amber-700'
              }
            >
              {book.condition}
            </span>
          </div>

          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-1 mt-1 font-normal">
            By {book.author}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            {book.transactionType === 'Exchange' ? (
              <span className="text-sm font-bold text-emerald-700">Exchange Only</span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-semibold text-slate-500">₹</span>
                <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                  {book.price}
                </span>
                {book.transactionType === 'Both' && (
                  <span className="text-[11px] text-slate-600 ml-1">or Swap</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center text-[11px] text-slate-600">
            <MapPin className="w-3 h-3 text-slate-500 mr-1 shrink-0" />
            <span className="truncate max-w-[110px]">{book.city}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(book);
          }}
          className="mt-3 w-full py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-teal-600 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
