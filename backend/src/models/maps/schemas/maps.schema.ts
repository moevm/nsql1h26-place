import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type MapDocument = HydratedDocument<Map>;

class Coordinates {
    @Prop({ required: true })
    x: number;

    @Prop({ required: true })
    y: number;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Map {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user_id: Types.ObjectId;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, default: '' })
    description: string;

    @Prop({ type: String, required: true })
    country: string;

    @Prop({ type: String, required: true })
    area: string;

    @Prop({ type: Coordinates, _id: false, required: true })
    coordinates: Coordinates;

    @Prop({ default: true })
    visible: boolean;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: String })
    image_path: string;
}

export const MapSchema = SchemaFactory.createForClass(Map);