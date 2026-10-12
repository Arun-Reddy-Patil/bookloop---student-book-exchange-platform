import { Response } from 'express';
import { db, BookDoc } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getAllBooks = (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      search,
      category,
      condition,
      transactionType,
      minPrice,
      maxPrice,
      city,
      sort = 'newest',
      page = '1',
      limit = '9'
    } = req.query as Record<string, string | undefined>;

    let books = db.getBooks();

    // Text search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.isbn && b.isbn.toLowerCase().includes(q)) ||
          b.category.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.sellerCollege.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && category !== 'All') {
      books = books.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    // Condition filter
    if (condition && condition !== 'All') {
      books = books.filter((b) => b.condition.toLowerCase() === condition.toLowerCase());
    }

    // Transaction type filter
    if (transactionType && transactionType !== 'All') {
      books = books.filter(
        (b) => b.transactionType === transactionType || b.transactionType === 'Both'
      );
    }

    // Price range filter
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) {
        books = books.filter((b) => b.price >= min);
      }
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        books = books.filter((b) => b.price <= max);
      }
    }

    // City filter
    if (city && city !== 'All') {
      books = books.filter((b) => b.city.toLowerCase() === city.toLowerCase());
    }

    // Sorting
    if (sort === 'price-asc') {
      books.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      books.sort((a, b) => b.price - a.price);
    } else if (sort === 'popular') {
      books.sort((a, b) => b.views - a.views);
    } else {
      // 'newest' default
      books.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 9);
    const total = books.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedBooks = books.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      success: true,
      books: paginatedBooks,
      total,
      totalPages,
      currentPage: pageNum,
      limit: limitNum
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving books' });
  }
};

export const getFeaturedBooks = (_req: AuthenticatedRequest, res: Response) => {
  try {
    const books = db.getBooks();
    // Featured selection: available books with rich details and highest engagement
    const featured = books.filter((b) => b.status === 'Available').slice(0, 4);
    return res.status(200).json({ success: true, books: featured });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving featured books' });
  }
};

export const getBookById = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const book = db.findBookById(id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    // Increment views
    db.updateBook(id, { views: book.views + 1 });

    return res.status(200).json({ success: true, book: { ...book, views: book.views + 1 } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving book' });
  }
};

export const createBook = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const {
      title,
      author,
      isbn,
      category,
      edition,
      description,
      condition,
      transactionType,
      price,
      preferredExchange,
      coverImage,
      coverPalette,
      city,
      locality
    } = req.body;

    if (!title || !author || !category || !description || !condition || !transactionType || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory fields: Title, Author, Category, Description, Condition, Transaction Type, and City.'
      });
    }

    const numericPrice = transactionType === 'Exchange' ? 0 : Number(price) || 0;
    if (transactionType !== 'Exchange' && numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please specify a valid price for books listed for sale.'
      });
    }

    const paletteList = ['navy', 'teal', 'indigo', 'emerald', 'slate', 'sky', 'amber'];
    const chosenPalette = coverPalette || paletteList[Math.floor(Math.random() * paletteList.length)];

    const newBook: BookDoc = {
      id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      author: author.trim(),
      isbn: isbn ? isbn.trim() : undefined,
      category: category.trim(),
      edition: edition ? edition.trim() : undefined,
      description: description.trim(),
      condition,
      transactionType,
      price: numericPrice,
      preferredExchange: preferredExchange ? preferredExchange.trim() : undefined,
      coverImage: coverImage || '',
      coverPalette: chosenPalette,
      city: city.trim(),
      locality: locality ? locality.trim() : 'Campus Area',
      sellerId: req.user.id,
      sellerName: req.user.name,
      sellerCollege: req.user.college,
      sellerEmail: req.user.email,
      sellerPhone: req.user.phone,
      status: 'Available',
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createBook(newBook);

    return res.status(201).json({
      success: true,
      message: 'Your textbook listing has been published successfully!',
      book: newBook
    });
  } catch (error) {
    console.error('Create book error:', error);
    return res.status(500).json({ success: false, message: 'Server error while creating book listing' });
  }
};

export const updateBook = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const existing = db.findBookById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    // Check ownership or admin
    if (existing.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Permission denied. You can only edit your own listings.'
      });
    }

    const updates = req.body;
    if (updates.price !== undefined) {
      updates.price = Number(updates.price) || 0;
    }

    const updated = db.updateBook(id, updates);
    return res.status(200).json({
      success: true,
      message: 'Book listing updated successfully',
      book: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating book listing' });
  }
};

export const deleteBook = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const existing = db.findBookById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    if (existing.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Permission denied. You can only delete your own listings.'
      });
    }

    db.deleteBook(id);
    return res.status(200).json({ success: true, message: 'Book listing removed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting book listing' });
  }
};

export const getUserListings = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userBooks = db.getBooks().filter((b) => b.sellerId === req.user!.id);
    return res.status(200).json({ success: true, books: userBooks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving user listings' });
  }
};

export const getPlatformStats = (_req: AuthenticatedRequest, res: Response) => {
  try {
    const books = db.getBooks();
    const users = db.getUsers();
    const requests = db.getRequests();

    const booksListed = books.length;
    const studentsRegistered = users.length;
    const successfulExchanges = requests.filter((r) => r.status === 'Completed').length;
    const collegesCount = new Set(users.map((u) => u.college)).size;

    return res.status(200).json({
      success: true,
      stats: {
        booksListed,
        studentsRegistered,
        successfulExchanges,
        collegesRepresented: collegesCount,
        availableListings: books.filter((b) => b.status === 'Available').length
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};
