import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { ExhibitionService } from '../services/exhibitionService.js';
import { FileService } from '../services/fileService.js';
import cache from '../middleware/cache.js';
import redisClient from '../config/redis.js';

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('Exhibition Route:', req.method, req.path);
  next();
});

// Run cleanup every hour
export const cleanupInterval = setInterval(() => ExhibitionService.cleanupOrphanedFiles(), 60 * 60 * 1000);

// Run cleanup on server start
ExhibitionService.cleanupOrphanedFiles();

// Get all exhibition centers (cached for 5 minutes)
router.get('/', cache(300), async (req, res) => {
  try {
    const centers = await ExhibitionService.getAll();
    res.json(centers);
  } catch (error) {
    console.error('Error fetching exhibition centers:', error);
    res.status(500).json({ error: 'Failed to fetch exhibition centers' });
  }
});

// Get a specific exhibition center (cached for 5 minutes)
router.get('/:id', cache(300), async (req, res) => {
  try {
    const center = await ExhibitionService.getById(req.params.id);
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

// Create a new exhibition center
router.post('/', upload.array('floorPlans'), async (req, res) => {
  const uploadedFiles: Express.Multer.File[] = [];
  try {
    const { name } = req.body;
    const levels = Array.isArray(req.body.levels) ? req.body.levels : [req.body.levels];
    const files = req.files as Express.Multer.File[];
    uploadedFiles.push(...files);
    
    if (!Array.isArray(levels) || levels.length !== files.length) {
      throw new Error('Levels array must match the number of uploaded files');
    }

    const exhibitionCenter = await ExhibitionService.create({ name, files, levels });
    
    // Invalidate the list cache
    await redisClient.del('cache:/api/exhibitions');
    
    res.status(201).json(exhibitionCenter);
  } catch (error) {
    await FileService.cleanupFiles(uploadedFiles);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

// Update an exhibition center
router.put('/:id', upload.array('floorPlans'), async (req, res) => {
  const uploadedFiles: Express.Multer.File[] = [];
  try {
    const { name, levels } = req.body;
    const files = req.files as Express.Multer.File[];
    uploadedFiles.push(...files);
    
    if (files.length > 0 && (!Array.isArray(levels) || levels.length !== files.length)) {
      throw new Error('Levels array must match the number of uploaded files');
    }

    const center = await ExhibitionService.update(req.params.id, { name, files, levels });
    
    // Invalidate both list and specific item cache
    await Promise.all([
      redisClient.del('cache:/api/exhibitions'),
      redisClient.del(`cache:/api/exhibitions/${req.params.id}`)
    ]);
    
    res.json(center);
  } catch (error) {
    await FileService.cleanupFiles(uploadedFiles);
    if (error instanceof Error) {
      if (error.message === 'Exhibition center not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

// Delete an exhibition center
router.delete('/:id', async (req, res) => {
  try {
    await ExhibitionService.delete(req.params.id);
    
    // Invalidate both list and specific item cache
    await Promise.all([
      redisClient.del('cache:/api/exhibitions'),
      redisClient.del(`cache:/api/exhibitions/${req.params.id}`)
    ]);
    
    res.json({ message: 'Exhibition center deleted successfully' });
  } catch (error) {
    console.error('Error deleting exhibition center:', error);
    if (error instanceof Error && error.message === 'Exhibition center not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete exhibition center' });
    }
  }
});

export default router;
