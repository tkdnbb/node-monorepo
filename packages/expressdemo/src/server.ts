import express from 'express';
import path from 'path';
import cors from 'cors';
import graphRoutes from './routes/graphRoutes.js';
import { config } from './config/index.js';

const app = express();

// Enable CORS for development
app.use(cors({
  origin: config.corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Mount API routes
app.use('/api', graphRoutes);

// Serve static files
app.use(express.static(config.publicDir));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(config.publicDir, 'index.html'));
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${config.port}`);
});
