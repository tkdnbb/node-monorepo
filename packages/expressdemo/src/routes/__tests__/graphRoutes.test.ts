import request from 'supertest';
import express, { Request, Response } from 'express';
import router from '../graphRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { jest, describe, it, expect, beforeEach, beforeAll, afterAll } from '@jest/globals';
import fs from 'fs';
import { config } from '../../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create unique test directories
const testId = Date.now();
const testConfig = {
  uploadDir: path.join(config.uploadDir, `test-${testId}`),
  tempDir: path.join(config.tempDir, `test-${testId}`),
  dataDir: path.join(config.dataDir, `test-${testId}`)
};

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

// Mock upload middleware
jest.mock('../../middleware/upload.js', () => ({
  upload: {
    single: () => (req: Request, res: Response, next: Function) => {
      const tempFileName = `temp-${Date.now()}-test-image.png`;
      const tempFilePath = path.join(testConfig.tempDir, tempFileName);

      fs.copyFileSync(
        path.join(__dirname, '../../../public/img/psnet.jpg'),
        tempFilePath
      );

      req.file = {
        fieldname: 'file',
        originalname: 'test-image.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: testConfig.tempDir,
        filename: tempFileName,
        path: tempFilePath,
        size: fs.statSync(tempFilePath).size,
        stream: fs.createReadStream(tempFilePath),
        buffer: fs.readFileSync(tempFilePath)
      };
      next();
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/', router);

// Ensure test directories exist
beforeAll(() => {
  Object.values(testConfig).forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });
});

// Clean up test directories after all tests
afterAll(() => {
  Object.values(testConfig).forEach(dir => {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (error) {
      console.warn(`Warning: Could not remove directory ${dir}:`, error);
    }
  });
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
