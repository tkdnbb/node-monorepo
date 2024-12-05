import fs from 'fs';
import path from 'path';
import { processImageToGraph, saveRoad } from 'nodegrapher';
import { GraphData } from '../types/graph.js';
import { config } from '../config/index.js';

export class GraphService {
  static async processFullGraph(imagePath: string, maxContain: number): Promise<GraphData> {
    const outputPath = path.join(config.dataDir, 'output.json');
    return await processImageToGraph(imagePath, outputPath, maxContain);
  }

  static async processRoadGraph(imagePath: string, maxContain: number): Promise<GraphData> {
    const outputPath = path.join(config.dataDir, 'road-output.json');
    return await saveRoad(imagePath, outputPath, maxContain);
  }

  static getGraphData(type: 'full' | 'road'): GraphData {
    const filename = type === 'full' ? 'output.json' : 'road-output.json';
    const outputPath = path.join(config.dataDir, filename);
    
    if (fs.existsSync(outputPath)) {
      return JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    }

    // Return mock data if no file exists
    return {
      nodes: type === 'full' ? [
        { x: 80, y: 79, label: "Entrance" },
        { x: 180, y: 79, label: "Hall A" },
        { x: 280, y: 79, label: "Hall B" },
        { x: 180, y: 179, label: "Conference Room" },
        { x: 280, y: 179, label: "Exhibition Area" }
      ] : [
        { x: 80, y: 79, label: "Road Start" },
        { x: 180, y: 79, label: "Intersection A" },
        { x: 280, y: 79, label: "Road End" }
      ],
      lines: type === 'full' ? [
        [0, 1], [1, 2], [1, 3], [2, 4], [3, 4]
      ] : [
        [0, 1], [1, 2]
      ]
    };
  }
}
