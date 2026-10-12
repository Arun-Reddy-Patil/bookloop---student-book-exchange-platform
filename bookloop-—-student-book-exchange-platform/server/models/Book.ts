/**
 * Book Model & Schema definition for BookLoop (MERN Stack)
 */
export interface IBook {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  edition?: string;
  description: string;
  condition: 'Like New' | 'Good' | 'Fair' | 'Poor';
  transactionType: 'Sell' | 'Exchange' | 'Both';
  price: number;
  preferredExchange?: string;
  coverImage: string;
  coverPalette?: string;
  city: string;
  locality: string;
  sellerId: string;
  sellerName: string;
  sellerCollege: string;
  sellerEmail: string;
  sellerPhone?: string;
  status: 'Available' | 'Pending' | 'Completed' | 'Sold' | 'Exchanged';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export const BOOK_CATEGORIES = [
  'Computer Science',
  'Physics',
  'Mathematics',
  'Medical',
  'Mechanical Engineering',
  'Electrical & Electronics',
  'Civil Engineering',
  'Chemistry',
  'Economics & Commerce',
  'Law & Humanities',
  'Management & Business',
  'General Academic'
] as const;

export const BOOK_CONDITIONS = ['Like New', 'Good', 'Fair', 'Poor'] as const;
export const TRANSACTION_TYPES = ['Sell', 'Exchange', 'Both'] as const;
