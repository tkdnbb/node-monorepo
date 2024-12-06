import mongoose, { Schema, Document } from 'mongoose';

export interface IFloorPlan {
  level: string;
  imageUrl: string;
  imageType: string;
}

export interface IExhibitionCenter extends Document {
  name: string;
  floorPlans: IFloorPlan[];
  createdAt: Date;
  updatedAt: Date;
}

const FloorPlanSchema = new Schema({
  level: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageType: { type: String, required: true }
});

const ExhibitionCenterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  floorPlans: [FloorPlanSchema]
}, {
  timestamps: true
});

export default mongoose.model<IExhibitionCenter>('ExhibitionCenter', ExhibitionCenterSchema);
