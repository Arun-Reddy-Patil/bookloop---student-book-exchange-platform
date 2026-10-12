# BookLoop — Student Book Exchange Platform

**BookLoop** is a full-stack academic textbook marketplace and exchange platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with Tailwind CSS. It enables college students to buy, sell, and exchange used academic textbooks safely and affordably on campuses.

---

## 🌟 Key Features

1. **Student Textbook Marketplace**:
   - Filter by Academic Faculty (Computer Science, Physics, Medical, Engineering, Economics, etc.).
   - Multi-criteria filtering by Condition (Like New, Good, Fair, Poor), Transaction Type (For Sale, Exchange Only, Both), Price Range (INR), and Campus Location.
   - Dynamic sorting (Newest, Price Low to High, Price High to Low, Most Popular).
   - Fast keyword search spanning title, author, ISBN, and descriptions.

2. **Stylized Realistic Textbook Jackets**:
   - Procedurally rendered academic book jackets with collegiate typography, embossed spine effects, subject icons, and color palettes (`navy`, `teal`, `emerald`, `indigo`, `slate`, `sky`, `amber`).
   - Supports custom book cover uploads/URLs with automatic fallback containers.

3. **Purchase & Book Exchange Proposals**:
   - Peer-to-peer exchange workflow allowing students to specify the textbook they are offering in swap.
   - Built-in validation preventing students from requesting their own listings or unavailable books.
   - Status tracking: `Pending`, `Accepted`, `Rejected`, `Cancelled`, `Completed`.

4. **Student & Admin Dashboards**:
   - **Student Dashboard**: Real-time listing counters, manage/edit/delete personal listings, incoming request approval/rejection, sent request cancellation, and profile updates.
   - **Admin Moderation Panel**: Platform-wide metrics, student user role toggle (Student ↔ Admin), listing moderation, reported listings investigation, and contact message inbox.

5. **Security & Authentication**:
   - Secure password hashing with `bcryptjs`.
   - Signed JSON Web Tokens (JWT) for authenticated requests.
   - Role-Based Access Control (RBAC).

---

## 🏗️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js REST API
- **Persistence**: High-speed atomic JSON persistence engine with pre-seeded datasets, fully compatible with MongoDB & Mongoose schemas
- **Authentication**: JWT & Bcrypt

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
# Clone or navigate to the repository directory
cd bookloop

# Install dependencies
npm install
```

### Environment Configuration
Copy the `.env.example` file:
```bash
cp .env.example .env
```
Key environment variables:
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT signing
- `MONGODB_URI`: Optional MongoDB connection string (e.g. `mongodb://localhost:27017/bookloop`)

### Running Locally
```bash
# Start full-stack development server (Express API + Vite SPA)
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 👥 Demo Accounts

For quick inspection, the application provides instant demo login buttons on the login screen:

1. **Student Account**:
   - **Email**: `arunreddy9973@gmail.com`
   - **Password**: `Student@123`
   - **College**: Indian Institute of Technology (IIT)

2. **Admin Account**:
   - **Email**: `admin@bookloop.edu`
   - **Password**: `Admin@123`
   - **Role**: System Administrator & Moderator

---

## 📡 REST API Endpoints

- `POST /api/auth/register` — Register student account
- `POST /api/auth/login` — Authenticate and receive JWT
- `GET /api/auth/me` — Retrieve active user session
- `PUT /api/auth/profile` — Update user details
- `GET /api/books` — Query and filter textbooks
- `GET /api/books/featured` — Fetch homepage highlights
- `GET /api/books/:id` — Retrieve book details
- `POST /api/books` — Create new textbook listing (auth required)
- `PUT /api/books/:id` — Edit owned listing
- `DELETE /api/books/:id` — Remove listing
- `GET /api/books/user/my-listings` — Student's active listings
- `GET /api/books/stats` — Platform metrics
- `POST /api/requests` — Propose purchase or exchange
- `GET /api/requests/sent` — Outgoing proposals
- `GET /api/requests/received` — Incoming proposals
- `PATCH /api/requests/:id/status` — Accept, decline, or complete deal
- `POST /api/contact` — Submit support inquiry
- `POST /api/admin/report` — Report suspicious listing
- `GET /api/admin/overview` — Admin overview KPIs
- `GET /api/admin/users` — User management
- `PATCH /api/admin/users/:id/role` — Update user role
- `GET /api/admin/reports` — Audit reported listings
