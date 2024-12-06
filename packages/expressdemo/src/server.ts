import express from 'express';
import path from 'path';
import cors from 'cors';
import graphRoutes from './routes/graphRoutes.js';
import exhibitionRoutes from './routes/exhibitionRoutes.js';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for development
app.use(cors({
  origin: config.corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Mount API routes
app.use('/api', graphRoutes);
app.use('/api/exhibitions', exhibitionRoutes);

// Serve static files
app.use(express.static(config.publicDir));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(config.publicDir, 'index.html'));
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${config.port}`);
  console.log('Available routes:');
  console.log('/api/exhibitions - Exhibition center routes');
  console.log('/api - Graph routes');
});
