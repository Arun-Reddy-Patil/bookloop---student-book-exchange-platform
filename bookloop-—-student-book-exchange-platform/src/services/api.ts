import { Book, User, ExchangeRequest, Report, ContactMessage, PlatformStats } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('bookloop_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(userData: any): Promise<{ success: boolean; token: string; user: User; message: string }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(credentials: { email: string; password: string }): Promise<{ success: boolean; token: string; user: User; message: string }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    return request('/auth/me');
  },

  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; user: User; message: string }> {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Books
  async getBooks(params: Record<string, string | number | undefined> = {}): Promise<{
    success: boolean;
    books: Book[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        query.append(key, String(val));
      }
    });
    return request(`/books?${query.toString()}`);
  },

  async getFeaturedBooks(): Promise<{ success: boolean; books: Book[] }> {
    return request('/books/featured');
  },

  async getBookById(id: string): Promise<{ success: boolean; book: Book }> {
    return request(`/books/${id}`);
  },

  async createBook(bookData: any): Promise<{ success: boolean; book: Book; message: string }> {
    return request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  },

  async updateBook(id: string, updates: Partial<Book>): Promise<{ success: boolean; book: Book; message: string }> {
    return request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteBook(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/books/${id}`, {
      method: 'DELETE'
    });
  },

  async getMyListings(): Promise<{ success: boolean; books: Book[] }> {
    return request('/books/user/my-listings');
  },

  async getStats(): Promise<{ success: boolean; stats: PlatformStats }> {
    return request('/books/stats');
  },

  // Requests
  async createRequest(reqData: {
    bookId: string;
    requestType: 'Purchase' | 'Exchange';
    offeredBookOrCash?: string;
    message: string;
    contactPhone?: string;
  }): Promise<{ success: boolean; request: ExchangeRequest; message: string }> {
    return request('/requests', {
      method: 'POST',
      body: JSON.stringify(reqData)
    });
  },

  async getSentRequests(): Promise<{ success: boolean; requests: ExchangeRequest[] }> {
    return request('/requests/sent');
  },

  async getReceivedRequests(): Promise<{ success: boolean; requests: ExchangeRequest[] }> {
    return request('/requests/received');
  },

  async updateRequestStatus(
    id: string,
    status: 'Accepted' | 'Rejected' | 'Cancelled' | 'Completed'
  ): Promise<{ success: boolean; request: ExchangeRequest; message: string }> {
    return request(`/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Reports
  async submitReport(data: { bookId: string; reason: string; details?: string }): Promise<{
    success: boolean;
    report: Report;
    message: string;
  }> {
    return request('/admin/report', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Contact
  async submitContact(data: { name: string; email: string; subject: string; message: string }): Promise<{
    success: boolean;
    message: string;
  }> {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Admin
  async getAdminOverview(): Promise<{
    success: boolean;
    stats: any;
    recentUsers: User[];
    recentListings: Book[];
    recentReports: Report[];
  }> {
    return request('/admin/overview');
  },

  async getAdminUsers(): Promise<{ success: boolean; users: User[] }> {
    return request('/admin/users');
  },

  async updateUserRole(id: string, role: 'student' | 'admin'): Promise<{ success: boolean; user: User; message: string }> {
    return request(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  },

  async getAdminReports(): Promise<{ success: boolean; reports: Report[] }> {
    return request('/admin/reports');
  },

  async updateReportStatus(id: string, status: string): Promise<{ success: boolean; report: Report }> {
    return request(`/admin/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async getAdminMessages(): Promise<{ success: boolean; messages: ContactMessage[] }> {
    return request('/admin/messages');
  }
};
