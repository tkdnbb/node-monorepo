import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';
import { GraphService } from '../services/graphService.js';
import { calculateMD5, findDuplicateImage } from '../utils/file.js';

export class GraphController {
  static async processMap(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No image file uploaded' });
        return;
      }

      const maxContain = parseInt(req.body.maxContain) || 2;
      if (maxContain < config.maxContainLimit.min || maxContain > config.maxContainLimit.max) {
        res.status(400).json({ 
          error: `maxContain must be between ${config.maxContainLimit.min} and ${config.maxContainLimit.max}` 
        });
        return;
      }

      if (!fs.existsSync(config.uploadDir)) {
        fs.mkdirSync(config.uploadDir, { recursive: true });
      }
      if (!fs.existsSync(config.tempDir)) {
        fs.mkdirSync(config.tempDir, { recursive: true });
      }

      const md5Hash = await calculateMD5(req.file.path);
      const duplicateFile = await findDuplicateImage(config.uploadDir, md5Hash);

      let finalPath: string;
      if (duplicateFile) {
        finalPath = path.join(config.uploadDir, duplicateFile);
        console.log('Duplicate image found, using existing file:', finalPath);
        fs.unlinkSync(req.file.path);
      } else {
        const newFileName = Date.now() + '-' + req.file.originalname;
        finalPath = path.join(config.uploadDir, newFileName);
        fs.renameSync(req.file.path, finalPath);
        console.log('Processing new image:', finalPath);
      }

      const graphData = await GraphService.processFullGraph(finalPath, maxContain);
      res.json(graphData);
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Error processing image:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async processRoadMap(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No image file uploaded' });
        return;
      }

      const maxContain = parseInt(req.body.maxContain) || 2;
      if (maxContain < config.maxContainLimit.min || maxContain > config.maxContainLimit.max) {
        res.status(400).json({ 
          error: `maxContain must be between ${config.maxContainLimit.min} and ${config.maxContainLimit.max}` 
        });
        return;
      }

      if (!fs.existsSync(config.uploadDir)) {
        fs.mkdirSync(config.uploadDir, { recursive: true });
      }
      if (!fs.existsSync(config.tempDir)) {
        fs.mkdirSync(config.tempDir, { recursive: true });
      }

      const md5Hash = await calculateMD5(req.file.path);
      const duplicateFile = await findDuplicateImage(config.uploadDir, md5Hash);

      let finalPath: string;
      if (duplicateFile) {
        finalPath = path.join(config.uploadDir, duplicateFile);
        console.log('Duplicate image found, using existing file:', finalPath);
        fs.unlinkSync(req.file.path);
      } else {
        const newFileName = Date.now() + '-' + req.file.originalname;
        finalPath = path.join(config.uploadDir, newFileName);
        fs.renameSync(req.file.path, finalPath);
        console.log('Processing new image:', finalPath);
      }

      const graphData = await GraphService.processRoadGraph(finalPath, maxContain);
      res.json(graphData);
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Error processing image:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getGraphData(req: Request, res: Response) {
    try {
      const graphData = GraphService.getGraphData('full');
      res.json(graphData);
    } catch (error) {
      console.error('Error reading graph data:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static getRoadGraphData(req: Request, res: Response) {
    try {
      const graphData = GraphService.getGraphData('road');
      res.json(graphData);
    } catch (error) {
      console.error('Error reading road graph data:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
