import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface UserDoc {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  college: string;
  course: string;
  city: string;
  role: 'student' | 'admin';
  phone?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface BookDoc {
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

export interface ExchangeRequestDoc {
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

export interface ReportDoc {
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

export interface ContactMessageDoc {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}

interface DatabaseSchema {
  users: UserDoc[];
  books: BookDoc[];
  requests: ExchangeRequestDoc[];
  reports: ReportDoc[];
  contactMessages: ContactMessageDoc[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

class DatabaseService {
  private data: DatabaseSchema = {
    users: [],
    books: [],
    requests: [],
    reports: [],
    contactMessages: []
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.seedInitialData();
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database file, recreating:', err);
      this.seedInitialData();
      this.save();
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private seedInitialData() {
    const passwordHash = bcrypt.hashSync('Student@123', 10);
    const adminHash = bcrypt.hashSync('Admin@123', 10);

    const adminUser: UserDoc = {
      id: 'usr_admin',
      name: 'System Administrator',
      email: 'admin@bookloop.edu',
      password: adminHash,
      college: 'Delhi Technological University',
      course: 'Computer Engineering & System Admin',
      city: 'New Delhi',
      role: 'admin',
      phone: '+91 98765 43210',
      bio: 'Platform moderator ensuring textbook exchanges stay safe and fair for all students.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: '2026-01-10T10:00:00.000Z'
    };

    const studentArun: UserDoc = {
      id: 'usr_arun',
      name: 'Arun Reddy',
      email: 'arunreddy9973@gmail.com',
      password: passwordHash,
      college: 'Indian Institute of Technology (IIT)',
      course: 'B.Tech Computer Science & Engineering',
      city: 'Bengaluru',
      role: 'student',
      phone: '+91 91234 56789',
      bio: '3rd year CS undergrad. Passionate about distributed systems and competitive algorithms.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      createdAt: '2026-02-01T11:20:00.000Z'
    };

    const studentPriya: UserDoc = {
      id: 'usr_priya',
      name: 'Priya Sharma',
      email: 'priya.sharma@du.ac.in',
      password: passwordHash,
      college: 'St. Stephen\'s College, Delhi University',
      course: 'B.Sc (Hons) Physics & Mathematics',
      city: 'New Delhi',
      role: 'student',
      phone: '+91 98111 22334',
      bio: 'Final year physics student looking to swap graduate entrance exam prep guides.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      createdAt: '2026-02-15T09:15:00.000Z'
    };

    const studentRohan: UserDoc = {
      id: 'usr_rohan',
      name: 'Rohan Mehta',
      email: 'rohan.mehta@bits-pilani.ac.in',
      password: passwordHash,
      college: 'BITS Pilani',
      course: 'B.E. Mechanical Engineering',
      city: 'Hyderabad',
      role: 'student',
      phone: '+91 97654 32190',
      bio: 'Graduating senior clearing out thermodynamics and mechanics references.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: '2026-03-01T14:40:00.000Z'
    };

    const studentAnanya: UserDoc = {
      id: 'usr_ananya',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@aiims.edu',
      password: passwordHash,
      college: 'All India Institute of Medical Sciences',
      course: 'MBBS - Medical Sciences',
      city: 'New Delhi',
      role: 'student',
      phone: '+91 99200 44556',
      bio: 'Pre-clinical medical student sharing illustrated anatomy and biochemistry atlases.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      createdAt: '2026-03-10T16:25:00.000Z'
    };

    this.data.users = [adminUser, studentArun, studentPriya, studentRohan, studentAnanya];

    const initialBooks: BookDoc[] = [
      {
        id: 'book_1',
        title: 'Introduction to Algorithms (CLRS)',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        isbn: '978-0262033848',
        category: 'Computer Science',
        edition: '3rd Edition',
        description: 'The definitive comprehensive guide to algorithms and data structures. In immaculate condition with no pen marks or missing pages. Ideal for Data Structures and Algorithm design courses and GATE preparation.',
        condition: 'Like New',
        transactionType: 'Both',
        price: 850,
        preferredExchange: 'Operating System Concepts (Silberschatz) or Computer Networks (Tanenbaum)',
        coverImage: '',
        coverPalette: 'navy',
        city: 'Bengaluru',
        locality: 'Koramangala / HSR Layout',
        sellerId: studentArun.id,
        sellerName: studentArun.name,
        sellerCollege: studentArun.college,
        sellerEmail: studentArun.email,
        sellerPhone: studentArun.phone,
        status: 'Available',
        views: 184,
        createdAt: '2026-03-15T09:00:00.000Z',
        updatedAt: '2026-03-15T09:00:00.000Z'
      },
      {
        id: 'book_2',
        title: 'Fundamentals of Physics (Halliday & Resnick)',
        author: 'David Halliday, Robert Resnick, Jearl Walker',
        isbn: '978-1118230718',
        category: 'Physics',
        edition: '10th Extended Edition',
        description: 'Core classic textbook for undergraduate physics, classical mechanics, electromagnetism, and optics. Crisp binding, covers are intact with minimal highlighting in chapter 4.',
        condition: 'Good',
        transactionType: 'Sell',
        price: 650,
        preferredExchange: '',
        coverImage: '',
        coverPalette: 'teal',
        city: 'New Delhi',
        locality: 'North Campus / Mall Road',
        sellerId: studentPriya.id,
        sellerName: studentPriya.name,
        sellerCollege: studentPriya.college,
        sellerEmail: studentPriya.email,
        sellerPhone: studentPriya.phone,
        status: 'Available',
        views: 142,
        createdAt: '2026-03-18T11:30:00.000Z',
        updatedAt: '2026-03-18T11:30:00.000Z'
      },
      {
        id: 'book_3',
        title: 'Guyton and Hall Textbook of Medical Physiology',
        author: 'John E. Hall, Michael E. Hall',
        isbn: '978-0323597128',
        category: 'Medical',
        edition: '14th South Asia Edition',
        description: 'Gold standard medical physiology text for MBBS students. Beautiful full-color diagrams, clinical correlations clearly readable. Used carefully for one semester.',
        condition: 'Good',
        transactionType: 'Exchange',
        price: 0,
        preferredExchange: 'Robbins Basic Pathology (10th Ed) or Gray\'s Anatomy for Students',
        coverImage: '',
        coverPalette: 'emerald',
        city: 'New Delhi',
        locality: 'Ansari Nagar / AIIMS Campus',
        sellerId: studentAnanya.id,
        sellerName: studentAnanya.name,
        sellerCollege: studentAnanya.college,
        sellerEmail: studentAnanya.email,
        sellerPhone: studentAnanya.phone,
        status: 'Available',
        views: 215,
        createdAt: '2026-03-20T14:10:00.000Z',
        updatedAt: '2026-03-20T14:10:00.000Z'
      },
      {
        id: 'book_4',
        title: 'Engineering Mechanics: Dynamics & Statics',
        author: 'J.L. Meriam, L.G. Kraige',
        isbn: '978-1118885840',
        category: 'Mechanical Engineering',
        edition: '8th SI Version',
        description: 'Comprehensive mechanical engineering textbook containing detailed problem sets and force vector analyses. Cover has minor shelf wear but internal pages are pristine.',
        condition: 'Good',
        transactionType: 'Sell',
        price: 490,
        preferredExchange: '',
        coverImage: '',
        coverPalette: 'slate',
        city: 'Hyderabad',
        locality: 'Shamirpet / BITS Campus',
        sellerId: studentRohan.id,
        sellerName: studentRohan.name,
        sellerCollege: studentRohan.college,
        sellerEmail: studentRohan.email,
        sellerPhone: studentRohan.phone,
        status: 'Available',
        views: 98,
        createdAt: '2026-03-22T08:45:00.000Z',
        updatedAt: '2026-03-22T08:45:00.000Z'
      },
      {
        id: 'book_5',
        title: 'Organic Chemistry: Structure and Function',
        author: 'K. Peter C. Vollhardt, Neil E. Schore',
        isbn: '978-1319079451',
        category: 'Chemistry',
        edition: '8th Global Edition',
        description: 'Superb guide for organic synthesis, orbital mechanics, and reaction mechanisms. Clean pages with protective plastic laminate sleeve included.',
        condition: 'Like New',
        transactionType: 'Both',
        price: 720,
        preferredExchange: 'Physical Chemistry by Peter Atkins (11th Ed)',
        coverImage: '',
        coverPalette: 'indigo',
        city: 'New Delhi',
        locality: 'North Campus / Vishwavidyalaya',
        sellerId: studentPriya.id,
        sellerName: studentPriya.name,
        sellerCollege: studentPriya.college,
        sellerEmail: studentPriya.email,
        sellerPhone: studentPriya.phone,
        status: 'Available',
        views: 167,
        createdAt: '2026-03-25T15:20:00.000Z',
        updatedAt: '2026-03-25T15:20:00.000Z'
      },
      {
        id: 'book_6',
        title: 'Principles of Macroeconomics',
        author: 'N. Gregory Mankiw',
        isbn: '978-0357133491',
        category: 'Economics & Commerce',
        edition: '9th Edition',
        description: 'Introductory and intermediate macroeconomics standard text covering fiscal policy, monetary systems, inflation, and growth models. Neat condition with minimal pencil notes.',
        condition: 'Good',
        transactionType: 'Sell',
        price: 420,
        preferredExchange: '',
        coverImage: '',
        coverPalette: 'sky',
        city: 'Bengaluru',
        locality: 'Electronic City / Hosur Road',
        sellerId: studentArun.id,
        sellerName: studentArun.name,
        sellerCollege: studentArun.college,
        sellerEmail: studentArun.email,
        sellerPhone: studentArun.phone,
        status: 'Available',
        views: 110,
        createdAt: '2026-03-28T10:15:00.000Z',
        updatedAt: '2026-03-28T10:15:00.000Z'
      },
      {
        id: 'book_7',
        title: 'Computer Networking: A Top-Down Approach',
        author: 'James F. Kurose, Keith W. Ross',
        isbn: '978-0136681557',
        category: 'Computer Science',
        edition: '8th Edition',
        description: 'Learn modern networking starting with application layer (HTTP, DNS) down to physical link layers. Clean book with original study CD/code access pamphlet intact.',
        condition: 'Like New',
        transactionType: 'Both',
        price: 780,
        preferredExchange: 'Database System Concepts (Korth) or Modern Compiler Implementation',
        coverImage: '',
        coverPalette: 'teal',
        city: 'Hyderabad',
        locality: 'Gachibowli / Hitech City',
        sellerId: studentRohan.id,
        sellerName: studentRohan.name,
        sellerCollege: studentRohan.college,
        sellerEmail: studentRohan.email,
        sellerPhone: studentRohan.phone,
        status: 'Available',
        views: 195,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z'
      },
      {
        id: 'book_8',
        title: 'Higher Engineering Mathematics',
        author: 'B.S. Grewal',
        isbn: '978-8193328491',
        category: 'Mathematics',
        edition: '44th Edition',
        description: 'The classic handbook for all Indian university engineering exams (Calculus, Differential Equations, Vector Calculus, Complex Variables, Fourier transforms). Sturdy binding.',
        condition: 'Fair',
        transactionType: 'Sell',
        price: 350,
        preferredExchange: '',
        coverImage: '',
        coverPalette: 'amber',
        city: 'New Delhi',
        locality: 'Rohini / Bawana',
        sellerId: studentPriya.id,
        sellerName: studentPriya.name,
        sellerCollege: studentPriya.college,
        sellerEmail: studentPriya.email,
        sellerPhone: studentPriya.phone,
        status: 'Available',
        views: 240,
        createdAt: '2026-04-02T13:45:00.000Z',
        updatedAt: '2026-04-02T13:45:00.000Z'
      }
    ];

    this.data.books = initialBooks;

    const initialRequest: ExchangeRequestDoc = {
      id: 'req_101',
      bookId: 'book_1',
      bookTitle: 'Introduction to Algorithms (CLRS)',
      bookCover: '',
      bookPrice: 850,
      sellerId: studentArun.id,
      sellerName: studentArun.name,
      buyerId: studentPriya.id,
      buyerName: studentPriya.name,
      buyerCollege: studentPriya.college,
      buyerEmail: studentPriya.email,
      buyerPhone: studentPriya.phone,
      requestType: 'Exchange',
      offeredBookOrCash: 'Silberschatz Operating System Concepts (9th Ed, Like New)',
      message: 'Hi Arun! I have the latest Silberschatz OS textbook in great shape. Can we meet near the campus library to inspect and exchange?',
      status: 'Pending',
      createdAt: '2026-04-03T16:00:00.000Z',
      updatedAt: '2026-04-03T16:00:00.000Z'
    };

    const initialCompletedReq: ExchangeRequestDoc = {
      id: 'req_100',
      bookId: 'book_6',
      bookTitle: 'Principles of Macroeconomics',
      bookCover: '',
      bookPrice: 420,
      sellerId: studentArun.id,
      sellerName: studentArun.name,
      buyerId: studentRohan.id,
      buyerName: studentRohan.name,
      buyerCollege: studentRohan.college,
      buyerEmail: studentRohan.email,
      buyerPhone: studentRohan.phone,
      requestType: 'Purchase',
      offeredBookOrCash: '₹420 Cash/UPI',
      message: 'Need this urgently for mid-term revisions next Monday. Happy to pay asking price in cash.',
      status: 'Completed',
      createdAt: '2026-03-30T10:00:00.000Z',
      updatedAt: '2026-04-01T15:30:00.000Z'
    };

    this.data.requests = [initialRequest, initialCompletedReq];

    this.data.reports = [
      {
        id: 'rep_1',
        bookId: 'book_8',
        bookTitle: 'Higher Engineering Mathematics',
        sellerName: studentPriya.name,
        reportedById: studentRohan.id,
        reportedByName: studentRohan.name,
        reason: 'Condition Discrepancy',
        details: 'Listing marked as Good originally, seller clarified some pages have water marks. Just wanted to flag for moderation review.',
        status: 'Reviewed',
        createdAt: '2026-04-03T09:30:00.000Z'
      }
    ];

    this.data.contactMessages = [
      {
        id: 'msg_1',
        name: 'Suresh Kumar',
        email: 'suresh.k@nitk.edu.in',
        subject: 'Campus Chapter Collaboration',
        message: 'We are organizing an annual textbook donation & exchange fair at NIT Karnataka. Would love to partner with BookLoop for digital listing tables!',
        createdAt: '2026-04-04T11:00:00.000Z',
        status: 'unread'
      }
    ];
  }

  // User queries
  public getUsers() {
    return this.data.users;
  }

  public findUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  public findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: UserDoc) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<UserDoc>) {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  // Book queries
  public getBooks() {
    return this.data.books;
  }

  public findBookById(id: string) {
    return this.data.books.find((b) => b.id === id);
  }

  public createBook(book: BookDoc) {
    this.data.books.unshift(book);
    this.save();
    return book;
  }

  public updateBook(id: string, updates: Partial<BookDoc>) {
    const idx = this.data.books.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.data.books[idx] = {
        ...this.data.books[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.data.books[idx];
    }
    return null;
  }

  public deleteBook(id: string) {
    const idx = this.data.books.findIndex((b) => b.id === id);
    if (idx !== -1) {
      const removed = this.data.books.splice(idx, 1)[0];
      this.save();
      return removed;
    }
    return null;
  }

  // Request queries
  public getRequests() {
    return this.data.requests;
  }

  public findRequestById(id: string) {
    return this.data.requests.find((r) => r.id === id);
  }

  public createRequest(req: ExchangeRequestDoc) {
    this.data.requests.unshift(req);
    this.save();
    return req;
  }

  public updateRequest(id: string, updates: Partial<ExchangeRequestDoc>) {
    const idx = this.data.requests.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.data.requests[idx] = {
        ...this.data.requests[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.data.requests[idx];
    }
    return null;
  }

  // Report queries
  public getReports() {
    return this.data.reports;
  }

  public createReport(rep: ReportDoc) {
    this.data.reports.unshift(rep);
    this.save();
    return rep;
  }

  public updateReport(id: string, updates: Partial<ReportDoc>) {
    const idx = this.data.reports.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.data.reports[idx] = { ...this.data.reports[idx], ...updates };
      this.save();
      return this.data.reports[idx];
    }
    return null;
  }

  // Contact queries
  public getContactMessages() {
    return this.data.contactMessages;
  }

  public createContactMessage(msg: ContactMessageDoc) {
    this.data.contactMessages.unshift(msg);
    this.save();
    return msg;
  }

  public updateContactMessage(id: string, updates: Partial<ContactMessageDoc>) {
    const idx = this.data.contactMessages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.data.contactMessages[idx] = { ...this.data.contactMessages[idx], ...updates };
      this.save();
      return this.data.contactMessages[idx];
    }
    return null;
  }
}

export const db = new DatabaseService();
