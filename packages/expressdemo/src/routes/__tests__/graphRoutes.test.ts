import request from 'supertest';
import express, { Response } from 'express';
import router from '../graphRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import fs from 'fs';
import { config } from '../../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mock GraphService
jest.mock('../../services/graphService.js', () => ({
  GraphService: {
    processFullGraph: jest.fn().mockResolvedValue({
      nodes: [{ x: 100, y: 100, label: "Test Node" }],
      lines: [[0, 1]]
    } as unknown as never),
    processRoadGraph: jest.fn().mockResolvedValue({
      nodes: [{ x: 100, y: 100, label: "Test Road" }],
      lines: [[0, 1]]
    } as unknown as never),
    getGraphData: jest.fn().mockResolvedValue({
      nodes: [{ x: 100, y: 100, label: "Test Node" }],
      lines: [[0, 1]]
    } as unknown as never),
    getRoadGraphData: jest.fn().mockResolvedValue({
      nodes: [{ x: 100, y: 100, label: "Test Road" }],
      lines: [[0, 1]]
    } as unknown as never)
  }
}));

// Mock only the graph data endpoints
jest.mock('../../controllers/graphController.js', () => ({
  GraphController: {
    getGraphData: jest.fn().mockImplementation((req, res) => {
      (res as Response).json({
        nodes: [{ x: 100, y: 100, label: "Test Node" }],
        lines: [[0, 1]]
      });
    }),
    getRoadGraphData: jest.fn().mockImplementation((req, res) => {
      (res as Response).json({
        nodes: [{ x: 100, y: 100, label: "Test Road" }],
        lines: [[0, 1]]
      });
    }),
    processMap: jest.fn(),
    processRoadMap: jest.fn()
  }
}));

jest.mock('nodegrapher', () => ({
  processImageToGraph: jest.fn(),
  saveRoad: jest.fn()
}));

interface GraphData {
  nodes: { x: number; y: number; label: string; }[];
  lines: number[][];
}

interface NodeGrapherMock {
  processImageToGraph: jest.Mock<(imagePath: string, outputPath: string, maxContainCount?: number, numX?: number) => Promise<GraphData | undefined>>;
  saveRoad: jest.Mock<(imagePath: string, outputPath: string, maxContainCount?: number, numX?: number) => Promise<GraphData | undefined>>;
}

const app = express();
app.use(express.json());
app.use('/', router);

// Clean up images inside upload directory after all tests
afterAll(() => {
  try {
    const files = fs.readdirSync(config.uploadDir);
    for (const file of files) {
      fs.unlinkSync(path.join(config.uploadDir, file));
    }
  } catch (error) {
    console.warn(`Warning: Could not remove files in ${config.uploadDir}:`, error);
  }
});

describe('Graph Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /process-map', () => {
    it('should process map image successfully', async () => {
      const imgPath = path.resolve(__dirname, '../../../public/img/psnet.jpg');
      const response = await request(app)
        .post('/process-map')
        .attach('image', imgPath)
        .field('maxContain', '2');
      expect(response.body).toHaveProperty('nodes');
      expect(response.body).toHaveProperty('lines');
    });

    it('should handle missing image file', async () => {
      const response = await request(app)
        .post('/process-map')
        .field('maxContain', '2');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('No image file uploaded');
    });
  });

  describe('POST /process-road', () => {
    it('should process road map image successfully', async () => {
      const imgPath = path.resolve(__dirname, '../../../public/img/psnet.jpg');
      const response = await request(app)
        .post('/process-road')
        .attach('image', imgPath)
        .field('maxContain', '2');

      expect(response.body).toHaveProperty('nodes');
      expect(response.body).toHaveProperty('lines');
    });

    it('should handle missing image file', async () => {
      const response = await request(app)
        .post('/process-road');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('No image file uploaded');
    });
  });

  describe('GET /graph-data', () => {
    it('should return graph data successfully', async () => {
      const response = await request(app).get('/graph-data');

      expect(response.body).toHaveProperty('nodes');
      expect(response.body).toHaveProperty('lines');
    });
  });

  describe('GET /road-graph-data', () => {
    it('should return road graph data successfully', async () => {
      const response = await request(app).get('/road-graph-data');

      expect(response.body).toHaveProperty('nodes');
      expect(response.body).toHaveProperty('lines');
    });
  });
});
