import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { deleteByIdOrThrow, findByIdOrThrow, updateByIdOrThrow } from "src/common/utils/crud.utils";
import { CreateMapDto } from "./dto/create-map.dto";
import { Map, MapDocument } from "./schemas/maps.schema";
import { UpdateMapDto } from "./dto/update-map.dto";
import { MapObject, ObjectDocument, } from "../objects/schemas/objects.schema";

@Injectable()
export class MapsService {
    constructor(@InjectModel(Map.name) private mapModel: Model<MapDocument>, @InjectModel(MapObject.name) private objectModel: Model<ObjectDocument>,) { }

    async create(createMapDto: CreateMapDto, userId: unknown): Promise<MapDocument> {
        const createdMap = new this.mapModel({ ...createMapDto, user_id: new Types.ObjectId(String(userId)) });
        return createdMap.save();
    }

    async findAll(userId: unknown, page = 1): Promise<MapDocument[]> {
        const pageNumber = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
        const limit = 10;
        return this.mapModel
            .find({ user_id: userId as Types.ObjectId })
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * limit)
            .limit(limit)
            .exec();
    }

    async findOne(id: string): Promise<MapDocument> {
        return findByIdOrThrow(this.mapModel.findById(id).exec(), id, 'Map');
    }

    async update(id: string, updateMapDto: UpdateMapDto): Promise<MapDocument> {
        return updateByIdOrThrow(
            this.mapModel.findByIdAndUpdate(id, updateMapDto, { new: true }).exec(),
            id,
            updateMapDto,
            'Map',
        );
    }

    async delete(id: string,): Promise<MapDocument> {
        const deletedMap = await deleteByIdOrThrow(this.mapModel.findByIdAndDelete(id).exec(), id, 'Map',);
        await this.objectModel.deleteMany({ map_id: deletedMap._id, });
        return deletedMap;
    }
}