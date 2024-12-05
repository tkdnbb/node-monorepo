import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { config } from '../config/index.js';

// Ensure temp directory exists
if (!fs.existsSync(config.tempDir)) {
  fs.mkdirSync(config.tempDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    // Double-check directory exists before saving
    if (!fs.existsSync(config.tempDir)) {
      fs.mkdirSync(config.tempDir, { recursive: true });
    }
    cb(null, config.tempDir);
  },
  filename(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, `temp-${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});
