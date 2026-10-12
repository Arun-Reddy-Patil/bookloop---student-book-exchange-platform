import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Phone, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all contact form fields.');
      return;
    }

    setLoading(true);
    try {
      await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      setSuccess(true);
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Contact Student Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have questions about book handovers, campus chapter partnerships, or account inquiries?
          Our team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Info Column */}
        <div className="md:col-span-5 bg-navy-950 text-white rounded-2xl p-8 space-y-6">
          <h2 className="text-lg font-bold">Campus Coordination Hub</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            BookLoop is maintained by college campus ambassadors and student developers across
            participating academic institutions.
          </p>

          <div className="space-y-4 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-teal-400" />
              <span>help@bookloop.edu</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>+91 98765 43210 (Mon–Fri, 9am–6pm IST)</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Koramangala, Bengaluru, Karnataka 560034</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Need urgent reporting for a suspicious listing? You can also click the &quot;Report&quot; button
            directly on any book details page.
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Send Us a Message</h2>

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>
                Thank you! Your message has been routed to our team. We will reply to your email
                within 24 hours.
              </span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arun Reddy"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@college.edu"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Campus Book Fair / Question regarding exchange"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
