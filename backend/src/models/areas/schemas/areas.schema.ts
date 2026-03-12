import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AreaDocument = HydratedDocument<Area>;

@Schema({ _id: false })
class Coordinates {
  @Prop({ type: Number, required: true })
  x: number;

  @Prop({ type: Number, required: true })
  y: number;
}

@Schema()
export class Area {
  @Prop({ type: Types.ObjectId, ref: 'Map', required: true })
  map_id: Types.ObjectId;

  @Prop({ type: String, required: true, maxlength: 100 })
  name: string;

  @Prop({ type: String, required: true, maxlength: 500 })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: 'Tag', required: true, default: [] })
  tags: Types.ObjectId[];

  @Prop({ type: Date, required: true, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: null })
  updated_at: Date | null;

  @Prop({ type: Coordinates, _id: false, required: true })
  coordinates: Coordinates;

  @Prop({ type: Number, required: true })
  radius: number;

  @Prop({ type: String, maxlength: 255, default: '' })
  image_path: string;
}

export const AreaSchema = SchemaFactory.createForClass(Area);