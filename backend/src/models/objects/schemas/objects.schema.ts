import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { ObjectType, type GeoJSONGeometry } from 'src/common/types/geojson.types';
import { validateGeoJSONGeometry } from 'src/common/utils/geo.validators';
import { validateTagArray } from 'src/common/utils/tag.validators';

export type ObjectDocument = HydratedDocument<MapObject>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class MapObject {
  @Prop({ type: Types.ObjectId, ref: 'Map', required: true })
  map_id: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(ObjectType), required: true })
  type: ObjectType;

  @Prop({ type: String, required: true, trim: true, minlength: 1, maxlength: 200 })
  name: string;

  @Prop({ type: String, trim: true, maxlength: 2000, default: '' })
  description: string;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: validateTagArray,
      message: 'Each tag must be a unique non-empty string of at most 50 characters',
    },
  })
  tags: string[];

  @Prop({ type: String, trim: true, maxlength: 255, default: '' })
  image_path: string;

  @Prop(raw({
    type: { type: String, enum: ['Point', 'LineString', 'Polygon'], required: true },
    coordinates: { type: [MongooseSchema.Types.Mixed], required: true },
  }))
  location: GeoJSONGeometry;
}

export const ObjectSchema = SchemaFactory.createForClass(MapObject);
ObjectSchema.index({ location: '2dsphere' });

ObjectSchema.pre('validate', function (this: ObjectDocument) {
  if (!validateGeoJSONGeometry(this.location)) {
    this.invalidate('location', 'Invalid GeoJSON geometry: type and coordinates must be consistent and within valid ranges');
  }
});
