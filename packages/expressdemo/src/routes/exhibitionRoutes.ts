import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { ExhibitionService } from '../services/exhibitionService.js';
import { FileService } from '../services/fileService.js';

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

    const exhibitionCenter = await ExhibitionService.create({ name, files, levels });
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

// Get all exhibition centers
router.get('/', async (req, res) => {
  try {
    console.log('Received GET request');
    const centers = await ExhibitionService.getAll();
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
    
    if (files.length > 0 && (!Array.isArray(levels) || levels.length !== files.length)) {
      throw new Error('Levels array must match the number of uploaded files');
    }

    const center = await ExhibitionService.update(req.params.id, { name, files, levels });
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
router.delete('/:id', async (req, res): Promise<void> => {
  try {
    console.log('Received DELETE request for ID:', req.params.id);
    await ExhibitionService.delete(req.params.id);
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
