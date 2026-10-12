import { Request, Response } from 'express';
import { db, ContactMessageDoc } from '../config/db.js';

export const submitContactMessage = (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields: Name, Email, Subject, and Message.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const newMsg: ContactMessageDoc = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    db.createContactMessage(newMsg);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our campus student support team will get back to you shortly.',
      contactMessage: newMsg
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error submitting contact message' });
  }
};
