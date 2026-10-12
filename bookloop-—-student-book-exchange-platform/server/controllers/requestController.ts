import { Response } from 'express';
import { db, ExchangeRequestDoc } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const createRequest = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { bookId, requestType, offeredBookOrCash, message, contactPhone } = req.body;

    if (!bookId || !requestType || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide book ID, request type, and a message to the seller.'
      });
    }

    const book = db.findBookById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Prevent students from requesting their own books
    if (book.sellerId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a purchase or exchange request for your own listing.'
      });
    }

    // Prevent requesting unavailable books
    if (book.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `This book is currently ${book.status.toLowerCase()} and cannot accept new requests.`
      });
    }

    // Check if duplicate pending request already exists
    const existing = db.getRequests().find(
      (r) => r.bookId === bookId && r.buyerId === req.user!.id && r.status === 'Pending'
    );
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You already have a pending request for this book. Please wait for the seller to respond.'
      });
    }

    const newRequest: ExchangeRequestDoc = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.coverImage || '',
      bookPrice: book.price,
      sellerId: book.sellerId,
      sellerName: book.sellerName,
      buyerId: req.user.id,
      buyerName: req.user.name,
      buyerCollege: req.user.college,
      buyerEmail: req.user.email,
      buyerPhone: contactPhone || req.user.phone,
      requestType: requestType === 'Exchange' ? 'Exchange' : 'Purchase',
      offeredBookOrCash: offeredBookOrCash ? offeredBookOrCash.trim() : undefined,
      message: message.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createRequest(newRequest);

    return res.status(201).json({
      success: true,
      message: 'Request sent successfully to the seller!',
      request: newRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    return res.status(500).json({ success: false, message: 'Error processing request' });
  }
};

export const getSentRequests = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const requests = db.getRequests().filter((r) => r.buyerId === req.user!.id);
    return res.status(200).json({ success: true, requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving sent requests' });
  }
};

export const getReceivedRequests = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const requests = db.getRequests().filter((r) => r.sellerId === req.user!.id);
    return res.status(200).json({ success: true, requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving received requests' });
  }
};

export const updateRequestStatus = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = db.findRequestById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const isSeller = request.sellerId === req.user.id;
    const isBuyer = request.buyerId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Authorization logic
    if (status === 'Cancelled') {
      if (!isBuyer && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Only the requester can cancel this request' });
      }
    } else if (status === 'Accepted' || status === 'Rejected' || status === 'Completed') {
      if (!isSeller && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Only the seller can update this request status' });
      }
    }

    const updated = db.updateRequest(id, { status });

    // Update book status if transaction progresses
    if (status === 'Accepted') {
      db.updateBook(request.bookId, { status: 'Pending' });
    } else if (status === 'Completed') {
      const outcome = request.requestType === 'Exchange' ? 'Exchanged' : 'Sold';
      db.updateBook(request.bookId, { status: outcome });
    } else if (status === 'Cancelled' || status === 'Rejected') {
      // Revert book back to Available if no other active accepted request
      const otherActive = db.getRequests().some(
        (r) => r.bookId === request.bookId && r.id !== request.id && r.status === 'Accepted'
      );
      if (!otherActive) {
        db.updateBook(request.bookId, { status: 'Available' });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Request marked as ${status}`,
      request: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating request status' });
  }
};
