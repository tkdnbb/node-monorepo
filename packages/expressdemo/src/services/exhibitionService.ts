import ExhibitionCenter from '../models/ExhibitionCenter.js';
import { FileService } from './fileService.js';
import { Types } from 'mongoose';

interface FloorPlan {
  level: string;
  imageUrl: string;
  imageType: string;
}

interface ExhibitionCenterInput {
  name: string;
  files: Express.Multer.File[];
  levels: string[];
}

export class ExhibitionService {
  static async getDatabaseFiles(): Promise<string[]> {
    const centers = await ExhibitionCenter.find();
    return centers.flatMap(center => 
      center.floorPlans.map(plan => plan.imageUrl.split('/').pop() as string)
    );
  }

  static async cleanupOrphanedFiles(): Promise<void> {
    try {
      const uploadedFiles = FileService.getUploadedFiles();
      const databaseFiles = await this.getDatabaseFiles();
      
      for (const file of uploadedFiles) {
        if (!databaseFiles.includes(file)) {
          await FileService.deleteFile(FileService.getFloorPlanPath(file));
          console.log('Cleaned up orphaned file:', file);
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      throw error;
    }
  }

  static createFloorPlans(files: Express.Multer.File[], levels: string[]): FloorPlan[] {
    return files.map((file, index) => ({
      level: levels[index],
      imageUrl: FileService.getFloorPlanUrl(file.filename),
      imageType: file.mimetype
    }));
  }

  static async create(input: ExhibitionCenterInput): Promise<any> {
    const floorPlans = this.createFloorPlans(input.files, input.levels);
    const exhibitionCenter = new ExhibitionCenter({
      name: input.name,
      floorPlans
    });
    return exhibitionCenter.save();
  }

  static async getAll(): Promise<any[]> {
    return ExhibitionCenter.find();
  }

  static async getById(id: string): Promise<any | null> {
    return ExhibitionCenter.findById(id);
  }

  static async update(id: string, input: ExhibitionCenterInput): Promise<any> {
    const center = await ExhibitionCenter.findById(id);
    if (!center) {
      throw new Error('Exhibition center not found');
    }

    if (input.files.length > 0) {
      try {
        // Delete old floor plan images
        await Promise.all(
          center.floorPlans.map(async (plan) => {
            const filename = plan.imageUrl.split('/').pop();
            if (filename) {
              try {
                await FileService.deleteFile(FileService.getFloorPlanPath(filename));
              } catch (error) {
                console.error(`Error deleting file ${filename}:`, error);
                // Continue with the update even if file deletion fails
              }
            }
          })
        );

        // Add new floor plans
        center.floorPlans = this.createFloorPlans(input.files, input.levels);
      } catch (error) {
        console.error('Error updating floor plans:', error);
        throw error;
      }
    }

    if (input.name) {
      center.name = input.name;
    }

    return center.save();
  }

  static async delete(id: string): Promise<void> {
    const center = await ExhibitionCenter.findById(id);
    if (!center) {
      throw new Error('Exhibition center not found');
    }

    try {
      // Delete floor plan images
      await Promise.all(
        center.floorPlans.map(async (plan) => {
          const filename = plan.imageUrl.split('/').pop();
          if (filename) {
            try {
              await FileService.deleteFile(FileService.getFloorPlanPath(filename));
            } catch (error) {
              console.error(`Error deleting file ${filename}:`, error);
              // Continue with deletion even if file removal fails
            }
          }
        })
      );

      await center.deleteOne();
    } catch (error) {
      console.error('Error during center deletion:', error);
      throw error;
    }
  }
}
