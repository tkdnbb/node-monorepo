import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if we're running from dist or directly
const isProduction = __dirname.endsWith('dist/config');
const rootDir = isProduction ? path.join(__dirname, '../..') : path.join(__dirname, '../..');

// Parse CORS origins from environment variable
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:8081', 'http://localhost:19006'];

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  uploadDir: process.env.UPLOAD_DIR || path.join(rootDir, 'public/uploads'),
  tempDir: process.env.TEMP_DIR || path.join(os.tmpdir(), 'expressdemo-temp'),
  dataDir: process.env.DATA_DIR || path.join(rootDir, 'public/data'),
  publicDir: process.env.PUBLIC_DIR || path.join(rootDir, 'public'),
  maxContainLimit: { 
    min: parseInt(process.env.MAX_CONTAIN_MIN || '1', 10), 
    max: parseInt(process.env.MAX_CONTAIN_MAX || '10', 10) 
  },
  corsOrigins
} as const;
