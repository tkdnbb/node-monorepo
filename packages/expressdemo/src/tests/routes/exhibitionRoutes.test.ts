import request from 'supertest';
import { describe, it, afterAll, beforeAll, expect } from '@jest/globals';
import { app } from '../setup.js';
import exhibitionRoutes, { cleanupInterval } from '../../routes/exhibitionRoutes.js';
import ExhibitionCenter from '../../models/ExhibitionCenter.js';
import path from 'path';
import fs from 'fs';

// Setup routes
app.use('/api/exhibitions', exhibitionRoutes);

describe('Exhibition Center Routes', () => {
  const testImagePath = path.join(process.cwd(), 'public', 'uploads', 'floorplans', 'test-floor-plan.png');

  // Create test image buffer
  const createTestImage = () => {
    const width = 100;
    const height = 100;
    const buffer = Buffer.alloc(width * height * 4); // RGBA format
    return buffer;
  };

  beforeAll(() => {
    // Create uploads directory and test image
    fs.mkdirSync(path.join(process.cwd(), 'public', 'uploads', 'floorplans'), { recursive: true });
    fs.writeFileSync(testImagePath, createTestImage());
  });

  afterAll(() => {
    clearInterval(cleanupInterval);
    // Cleanup test files
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  describe('POST /api/exhibitions', () => {
    it('should create a new exhibition center with floor plans', async () => {
      const response = await request(app)
        .post('/api/exhibitions')
        .field('name', 'Test Exhibition Center')
        .field('levels[]', '1F')
        .attach('floorPlans', testImagePath);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Test Exhibition Center');
      expect(response.body.floorPlans).toHaveLength(1);
      expect(response.body.floorPlans[0]).toHaveProperty('level', '1F');
    });

    it('should return 400 if levels array does not match files', async () => {
      const response = await request(app)
        .post('/api/exhibitions')
        .field('name', 'Test Exhibition Center')
        .field('levels[]', '1F')
        .field('levels[]', '2F')
        .attach('floorPlans', testImagePath);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Levels array must match the number of uploaded files');
    });
  });

  describe('GET /api/exhibitions', () => {
    beforeEach(async () => {
      await ExhibitionCenter.create({
        name: 'Test Center',
        floorPlans: [{
          level: '1F',
          imageUrl: '/uploads/floorplans/test.png',
          imageType: 'image/png'
        }]
      });
    });

    it('should return all exhibition centers', async () => {
      const response = await request(app).get('/api/exhibitions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('name', 'Test Center');
    });
  });

  describe('GET /api/exhibitions/:id', () => {
    let testCenter: any;

    beforeEach(async () => {
      testCenter = await ExhibitionCenter.create({
        name: 'Test Center',
        floorPlans: [{
          level: '1F',
          imageUrl: '/uploads/floorplans/test.png',
          imageType: 'image/png'
        }]
      });
    });

    it('should return a specific exhibition center', async () => {
      const response = await request(app).get(`/api/exhibitions/${testCenter._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Test Center');
      expect(response.body.floorPlans).toHaveLength(1);
    });

    it('should return 404 for non-existent center', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app).get(`/api/exhibitions/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Exhibition center not found');
    });
  });

  describe('PUT /api/exhibitions/:id', () => {
    let testCenter: any;

    beforeEach(async () => {
      testCenter = await ExhibitionCenter.create({
        name: 'Test Center',
        floorPlans: [{
          level: '1F',
          imageUrl: '/uploads/floorplans/test.png',
          imageType: 'image/png'
        }]
      });
    });

    it('should update an exhibition center', async () => {
      const response = await request(app)
        .put(`/api/exhibitions/${testCenter._id}`)
        .field('name', 'Updated Center')
        .field('levels[]', '2F')
        .attach('floorPlans', testImagePath);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Center');
      expect(response.body.floorPlans[0]).toHaveProperty('level', '2F');
    });

    it('should return 404 for non-existent center', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/exhibitions/${fakeId}`)
        .field('name', 'Updated Center');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Exhibition center not found');
    });
  });

  describe('DELETE /api/exhibitions/:id', () => {
    let testCenter: any;

    beforeEach(async () => {
      testCenter = await ExhibitionCenter.create({
        name: 'Test Center',
        floorPlans: [{
          level: '1F',
          imageUrl: '/uploads/floorplans/test.png',
          imageType: 'image/png'
        }]
      });
    });

    it('should delete an exhibition center', async () => {
      const response = await request(app).delete(`/api/exhibitions/${testCenter._id}`);

      console.log(response);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Exhibition center deleted successfully');

      const deletedCenter = await ExhibitionCenter.findById(testCenter._id);
      expect(deletedCenter).toBeNull();
    });

    it('should return 404 for non-existent center', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app).delete(`/api/exhibitions/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Exhibition center not found');
    });
  });
});
