import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import type { GeoJSONGeometry } from "src/common/types/geojson.types";
import { validateGeoJSONGeometry } from "src/common/utils/geo.validators";
import { validateTagArray } from "src/common/utils/tag.validators";

export type MapDocument = HydratedDocument<Map>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Map {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user_id: Types.ObjectId;

    @Prop({ type: String, required: true, trim: true, minlength: 1, maxlength: 200 })
    name: string;

    @Prop({ type: String, trim: true, maxlength: 2000, default: '' })
    description: string;

    @Prop({ type: String, required: true, trim: true, minlength: 1, maxlength: 200 })
    area: string;

    @Prop(raw({
        type: { type: String, enum: ['Point', 'LineString', 'Polygon'], required: true },
        coordinates: { type: [MongooseSchema.Types.Mixed], required: true }
    }))
    location: GeoJSONGeometry;

    @Prop({ default: true })
    visible: boolean;

    @Prop({
        type: [String],
        default: [],
        validate: {
            validator: validateTagArray,
            message: 'Each tag must be a unique non-empty string of at most 50 characters',
        },
    })
    tags: string[];

    @Prop({ type: String, trim: true, maxlength: 255 })
    image_path: string;
}

export const MapSchema = SchemaFactory.createForClass(Map);
MapSchema.index({ location: '2dsphere' });

MapSchema.pre('validate', function (this: MapDocument) {
    if (!validateGeoJSONGeometry(this.location)) {
        this.invalidate('location', 'Invalid GeoJSON geometry: type and coordinates must be consistent and within valid ranges');
    }
});
