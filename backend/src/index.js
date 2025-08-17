import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import formRoutes from './routes/formRoutes.js';
import responseRoutes from './routes/responseRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import notFound from './middleware/notFound.js';

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logging & body parsing
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ----- CORS Setup -----
const allowedOrigins = [
  'http://localhost:5173',                    // Local dev
  'https://form-builder-c3qd.vercel.app'     // Deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
// ----------------------

// Static serving for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic root route
app.get('/', (req, res) => res.json({ ok: true }));

// API routes
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/upload', uploadRoutes);

// 404 middleware
app.use(notFound);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
