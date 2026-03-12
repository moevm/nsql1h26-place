import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMapDto } from "./dto/create-map.dto";
import { Map, MapDocument } from "./schemas/maps.schema";
import { UpdateMapDto } from "./dto/update-map.dto";

@Injectable()
export class MapsService {
    constructor(@InjectModel(Map.name) private mapModel: Model<MapDocument>) {}

    async create(createMapDto: CreateMapDto): Promise<MapDocument> {
        const createdMap = new this.mapModel(createMapDto);
        return createdMap.save();
    }

    async findAll(): Promise<MapDocument[]> {
        return this.mapModel.find().exec();
    }

    async findOne(id: string): Promise<MapDocument> {
        const map = await this.mapModel.findById(id).exec();
        if (!map) {
            throw new NotFoundException(`Map with id ${id} not found`);
        }
        return map;
    }

    async update(id: string, updateMapDto: UpdateMapDto): Promise<MapDocument> {
        const updatedMap = await this.mapModel
            .findByIdAndUpdate(id, updateMapDto, { new: true })
            .exec();

        if (!updatedMap) {
            throw new NotFoundException(`Map with id ${id} not found`);
        }

        return updatedMap;
    }

    async delete(id: string): Promise<MapDocument> {
        const deletedMap = await this.mapModel.findByIdAndDelete(id).exec();
        if (!deletedMap) {
            throw new NotFoundException(`Map with id ${id} not found`);
        }
        return deletedMap;
    }
}