import { Response } from 'express';
import { db } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getAdminOverview = (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getUsers();
    const books = db.getBooks();
    const requests = db.getRequests();
    const reports = db.getReports();
    const messages = db.getContactMessages();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalListings: books.length,
        availableBooks: books.filter((b) => b.status === 'Available').length,
        completedTransactions: requests.filter((r) => r.status === 'Completed').length,
        pendingReports: reports.filter((r) => r.status === 'Pending').length,
        unreadMessages: messages.filter((m) => m.status === 'unread').length
      },
      recentUsers: users.slice(-5).reverse().map(({ password: _, ...u }) => u),
      recentListings: books.slice(0, 5),
      recentReports: reports.slice(0, 5)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Admin overview error' });
  }
};

export const getAllUsers = (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getUsers().map(({ password: _, ...u }) => u);
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving users' });
  }
};

export const updateUserRole = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (role !== 'student' && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const updated = db.updateUser(id, { role });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password: _, ...safeUser } = updated;
    return res.status(200).json({ success: true, user: safeUser, message: 'User role updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating user role' });
  }
};

export const getAllReports = (_req: AuthenticatedRequest, res: Response) => {
  try {
    const reports = db.getReports();
    return res.status(200).json({ success: true, reports });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving reports' });
  }
};

export const updateReportStatus = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = db.updateReport(id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    return res.status(200).json({ success: true, report: updated, message: 'Report updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating report' });
  }
};

export const getContactMessages = (_req: AuthenticatedRequest, res: Response) => {
  try {
    const messages = db.getContactMessages();
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving messages' });
  }
};

export const updateContactMessageStatus = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = db.updateContactMessage(id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    return res.status(200).json({ success: true, message: 'Message status updated', contactMessage: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating message status' });
  }
};
