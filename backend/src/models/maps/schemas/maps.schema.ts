import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import type { GeoJSONGeometry } from "src/common/types/geojson.types";

export type MapDocument = HydratedDocument<Map>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Map {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user_id: Types.ObjectId;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, default: '' })
    description: string;

    @Prop({ type: String, required: true })
    area: string;

    @Prop(raw({
        type: { type: String, enum: ['Point', 'LineString', 'Polygon'], required: true },
        coordinates: { type: [MongooseSchema.Types.Mixed], required: true }
    }))
    location: GeoJSONGeometry;

    @Prop({ default: true })
    visible: boolean;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: String })
    image_path: string;
}

export const MapSchema = SchemaFactory.createForClass(Map);
MapSchema.index({ location: '2dsphere' });