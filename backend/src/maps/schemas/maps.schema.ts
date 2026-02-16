import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MapDocument = HydratedDocument<Map>;

@Schema()
export class Map {
    @Prop(String)
    userid: string;
};

export const MapSchema = SchemaFactory.createForClass(Map);