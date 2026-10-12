export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  city: string;
  role: 'student' | 'admin';
  phone?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface Book {
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

export interface ExchangeRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  bookPrice: number;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  buyerCollege: string;
  buyerEmail: string;
  buyerPhone?: string;
  requestType: 'Purchase' | 'Exchange';
  offeredBookOrCash?: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  bookId: string;
  bookTitle: string;
  sellerName: string;
  reportedById: string;
  reportedByName: string;
  reason: string;
  details: string;
  status: 'Pending' | 'Reviewed' | 'Dismissed' | 'Actioned';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface PlatformStats {
  booksListed: number;
  studentsRegistered: number;
  successfulExchanges: number;
  collegesRepresented: number;
  availableListings: number;
}
