import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/index.js';
import ExhibitionCenter from '../models/ExhibitionCenter.js';

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('Exhibition Route:', req.method, req.path);
  next();
});

// Helper function to get all files in the uploads directory
const getUploadedFiles = () => {
  const uploadDir = path.join(config.publicDir, 'uploads', 'floorplans');
  if (!fs.existsSync(uploadDir)) return [];
  return fs.readdirSync(uploadDir);
};

// Helper function to get all files referenced in the database
const getDatabaseFiles = async () => {
  const centers = await ExhibitionCenter.find();
  return centers.flatMap(center => 
    center.floorPlans.map(plan => plan.imageUrl.split('/').pop())
  );
};

// Cleanup orphaned files
const cleanupOrphanedFiles = async () => {
  try {
    const uploadedFiles = getUploadedFiles();
    const databaseFiles = await getDatabaseFiles();
    
    for (const file of uploadedFiles) {
      if (!databaseFiles.includes(file)) {
        const filePath = path.join(config.publicDir, 'uploads', 'floorplans', file);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting orphaned file:', err);
          else console.log('Cleaned up orphaned file:', file);
        });
      }
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

// Run cleanup every hour
export const cleanupInterval = setInterval(cleanupOrphanedFiles, 60 * 60 * 1000);

// Run cleanup on server start
cleanupOrphanedFiles();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(config.publicDir, 'uploads', 'floorplans');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG and WebP are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create a new exhibition center with floor plans
router.post('/', upload.array('floorPlans'), async (req, res) => {
  const uploadedFiles: Express.Multer.File[] = [];
  try {
    console.log('Received POST request');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    const { name, levels } = req.body;
    const files = req.files as Express.Multer.File[];
    uploadedFiles.push(...files);
    
    if (!Array.isArray(levels) || levels.length !== files.length) {
      throw new Error('Levels array must match the number of uploaded files');
    }

    const floorPlans = files.map((file, index) => ({
      level: levels[index],
      imageUrl: `/uploads/floorplans/${file.filename}`,
      imageType: file.mimetype
    }));

    const exhibitionCenter = new ExhibitionCenter({
      name,
      floorPlans
    });

    await exhibitionCenter.save();
    res.status(201).json(exhibitionCenter);
  } catch (error) {
    // Clean up uploaded files if there's an error
    uploadedFiles.forEach(file => {
      const filePath = path.join(config.publicDir, 'uploads', 'floorplans', file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file after failed upload:', err);
      });
    });

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

// Get all exhibition centers
router.get('/', async (req, res) => {
  try {
    console.log('Received GET request');
    const centers = await ExhibitionCenter.find();
    res.json(centers);
  } catch (error) {
    console.error('Error fetching exhibition centers:', error);
    res.status(500).json({ error: 'Failed to fetch exhibition centers' });
  }
});

// Get a specific exhibition center
router.get('/:id', async (req, res) => {
  try {
    console.log('Received GET request for ID:', req.params.id);
    const center = await ExhibitionCenter.findById(req.params.id);
    if (!center) {
      res.status(404).json({ error: 'Exhibition center not found' });
      return;
    }
    res.json(center);
  } catch (error) {
    console.error('Error fetching exhibition center:', error);
    res.status(500).json({ error: 'Failed to fetch exhibition center' });
  }
});

// Update an exhibition center
router.put('/:id', upload.array('floorPlans'), async (req, res): Promise<void> => {
  const uploadedFiles: Express.Multer.File[] = [];
  try {
    console.log('Received PUT request for ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    const { name, levels } = req.body;
    const files = req.files as Express.Multer.File[];
    uploadedFiles.push(...files);
    
    const center = await ExhibitionCenter.findById(req.params.id);
    if (!center) {
      res.status(404).json({ error: 'Exhibition center not found' });
      return;
    }

    if (files.length > 0) {
      if (!Array.isArray(levels) || levels.length !== files.length) {
        throw new Error('Levels array must match the number of uploaded files');
      }

      // Delete old floor plan images
      center.floorPlans.forEach(plan => {
        const imagePath = path.join(config.publicDir, plan.imageUrl);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting old floor plan:', err);
        });
      });

      // Add new floor plans
      center.floorPlans = files.map((file, index) => ({
        level: levels[index],
        imageUrl: `/uploads/floorplans/${file.filename}`,
        imageType: file.mimetype
      }));
    }

    if (name) {
      center.name = name;
    }

    await center.save();
    res.json(center);
  } catch (error) {
    // Clean up uploaded files if there's an error
    uploadedFiles.forEach(file => {
      const filePath = path.join(config.publicDir, 'uploads', 'floorplans', file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file after failed upload:', err);
      });
    });

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

// Delete an exhibition center
router.delete('/:id', async (req, res): Promise<void> => {
  try {
    console.log('Received DELETE request for ID:', req.params.id);
    const center = await ExhibitionCenter.findById(req.params.id);
    if (!center) {
      res.status(404).json({ error: 'Exhibition center not found' });
      return;
    }
    
    // Delete floor plan images
    center.floorPlans.forEach(plan => {
      const imagePath = path.join(config.publicDir, plan.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting floor plan:', err);
      });
    });

    await center.deleteOne();
    res.json({ message: 'Exhibition center deleted successfully' });
  } catch (error) {
    console.error('Error deleting exhibition center:', error);
    res.status(500).json({ error: 'Failed to delete exhibition center' });
  }
});

export default router;
