import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Map } from '../../maps/schemas/maps.schema';

export type RouteDocument = HydratedDocument<Route>;

@Schema({ _id: false })
export class Waypoint {
  @Prop(Number)
  x: number;

  @Prop(Number)
  y: number;

  @Prop(Number)
  ordinal_number: number;
}

@Schema()
export class Route {
  @Prop({ type: Types.ObjectId, ref: "Map", required: true })
  map_id: Types.ObjectId;

  @Prop({ type: String, required: true, default: '' })
  name: string;

  @Prop({ type: String, required: true, default: '' })
  description: string;

  @Prop({ type: [String], required: true, default: [] })
  tags: string[];

  @Prop({ type: String, required: true, default: '' })
  created_at: string;

  @Prop({ type: String, required: true, default: '' })
  updated_at: string;

  @Prop({ type: [Waypoint], required: true, default: [] })
  waypoints: Waypoint[];

  @Prop({ type: String, required: true, default: '' })
  image_path: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
