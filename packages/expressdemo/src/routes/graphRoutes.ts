import express from 'express';
import { GraphController } from '../controllers/graphController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/process-map', upload.single('image'), GraphController.processMap);
router.post('/process-road', upload.single('image'), GraphController.processRoadMap);
router.get('/graph-data', GraphController.getGraphData);
router.get('/road-graph-data', GraphController.getRoadGraphData);

export default router;
