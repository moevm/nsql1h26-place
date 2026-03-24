import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { ObjectType, type GeoJSONGeometry } from 'src/common/types/geojson.types';

export type ObjectDocument = HydratedDocument<MapObject>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class MapObject {
  @Prop({ type: Types.ObjectId, ref: 'Map', required: true })
  map_id: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(ObjectType), required: true })
  type: ObjectType;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: String, maxlength: 255, default: '' })
  image_path: string;

  @Prop(raw({
      type: { type: String, enum: ['Point', 'LineString', 'Polygon'], required: true },
      coordinates: { type: [MongooseSchema.Types.Mixed], required: true }
  }))
  location: GeoJSONGeometry;
}

export const ObjectSchema = SchemaFactory.createForClass(MapObject);
ObjectSchema.index({ location: '2dsphere' });