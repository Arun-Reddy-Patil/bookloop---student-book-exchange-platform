import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './server/routes/authRoutes.js';
import bookRoutes from './server/routes/bookRoutes.js';
import requestRoutes from './server/routes/requestRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';
import contactRoutes from './server/routes/contactRoutes.js';
import { authMiddleware } from './server/middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global auth extractor for requests with Bearer tokens
  app.use(authMiddleware);

  // Mount API endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/contact', contactRoutes);

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      platform: 'BookLoop MERN Server',
      timestamp: new Date().toISOString()
    });
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BookLoop MERN Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start BookLoop server:', err);
  process.exit(1);
});
