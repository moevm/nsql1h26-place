import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Map } from "./schemas/maps.schema";
import { UpdateMapDto } from "./dto/update-map.dto";

@Injectable()
export class MapsService {
    constructor(@InjectModel(Map.name) private mapModel: Model<Map>) {}

    async create(map: Map): Promise<Map> {
        const createdMap = new this.mapModel(map);
        return createdMap.save();
    }

    async findAll(): Promise<Map[]> {
        return this.mapModel.find().exec();
    }

    async findOne(id: string) {
        return this.mapModel.findOne({ _id: id }).exec();
    }

    async update(id: string, updateCatDto: UpdateMapDto) {
        return this.mapModel
            .findByIdAndUpdate({ _id: id }, updateCatDto, { new: true })
            .exec();
    }

    async delete(id: string) {
        const deletedCat = await this.mapModel
            .findByIdAndDelete({ _id: id })
            .exec();
        return deletedCat;
    }
}