import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
  @Prop(String)
  map_id: string;

  @Prop(String)
  name: string;

  @Prop(String)
  description: string;

  @Prop([String])
  tags: string[];

  @Prop(String)
  created_at: string;

  @Prop(String)
  updated_at: string;

  @Prop({ type: [Waypoint], default: [] })
  waypoints: Waypoint[];

  @Prop(String)
  image_path: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
