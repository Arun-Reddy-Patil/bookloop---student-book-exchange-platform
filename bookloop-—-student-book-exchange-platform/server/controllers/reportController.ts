import { Response } from 'express';
import { db, ReportDoc } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const createReport = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { bookId, reason, details } = req.body;

    if (!bookId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide book ID and reason for the report.'
      });
    }

    const book = db.findBookById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    const report: ReportDoc = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookId,
      bookTitle: book.title,
      sellerName: book.sellerName,
      reportedById: req.user.id,
      reportedByName: req.user.name,
      reason,
      details: details ? details.trim() : '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.createReport(report);

    return res.status(201).json({
      success: true,
      message: 'Report submitted for review. Thank you for helping keep BookLoop safe.',
      report
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error submitting report' });
  }
};
