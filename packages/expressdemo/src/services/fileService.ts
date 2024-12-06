import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

export class FileService {
  static getUploadedFiles(): string[] {
    const uploadDir = path.join(config.publicDir, 'uploads', 'floorplans');
    if (!fs.existsSync(uploadDir)) return [];
    return fs.readdirSync(uploadDir);
  }

  static async deleteFile(filePath: string): Promise<void> {
    console.log('Attempting to delete file:', filePath);
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        console.log('File does not exist:', filePath);
        resolve(); // Don't throw an error if file doesn't exist
        return;
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', filePath, err);
          reject(err);
        } else {
          console.log('Successfully deleted file:', filePath);
          resolve();
        }
      });
    });
  }

  static getFloorPlanPath(filename: string): string {
    return path.join(config.publicDir, 'uploads', 'floorplans', filename);
  }

  static getFloorPlanUrl(filename: string): string {
    return `/uploads/floorplans/${filename}`;
  }

  static async cleanupFiles(files: Express.Multer.File[]): Promise<void> {
    for (const file of files) {
      try {
        await this.deleteFile(this.getFloorPlanPath(file.filename));
      } catch (error) {
        console.error('Error cleaning up file:', error);
      }
    }
  }
}
