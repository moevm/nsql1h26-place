import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { Map, MapSchema } from "./schemas/maps.schema";
import { MapsController } from "./maps.controller";
import { MapsService } from "./maps.service";
import { MapObject, ObjectSchema, } from "../objects/schemas/objects.schema";

@Module({
    imports: [AuthModule, MongooseModule.forFeature([{ name: Map.name, schema: MapSchema }, { name: MapObject.name, schema: ObjectSchema, },])],
    controllers: [MapsController],
    providers: [MapsService]
})

export class MapsModule {}