import { Request, Response, NextFunction, RequestHandler } from 'express';
import redisClient from '../config/redis';

const cache = (duration: number): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedResponse = await redisClient.get(key);
      
      if (cachedResponse) {
        res.json(JSON.parse(cachedResponse));
        return;
      }

      const originalJson = res.json;
      res.json = function(body) {
        res.json = originalJson;
        redisClient.setex(key, duration, JSON.stringify(body));
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

export default cache; 