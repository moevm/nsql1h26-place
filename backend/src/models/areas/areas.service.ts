import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area, AreaDocument } from './schemas/areas.schema';

@Injectable()
export class AreasService {
  constructor(@InjectModel(Area.name) private areaModel: Model<AreaDocument>) {}

  async create(createAreaDto: CreateAreaDto): Promise<AreaDocument> {
    const createdArea = new this.areaModel(createAreaDto);
    return createdArea.save();
  }

  async findAll(): Promise<AreaDocument[]> {
    return this.areaModel.find().exec();
  }

  async findOne(id: string): Promise<AreaDocument> {
    const area = await this.areaModel.findById(id).exec();
    if (!area) {
      throw new NotFoundException(`Area with id ${id} not found`);
    }
    return area;
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<AreaDocument> {
    const updatedArea = await this.areaModel
      .findByIdAndUpdate(id, { ...updateAreaDto, updated_at: new Date() }, { new: true })
      .exec();

    if (!updatedArea) {
      throw new NotFoundException(`Area with id ${id} not found`);
    }

    return updatedArea;
  }

  async delete(id: string): Promise<AreaDocument> {
    const deletedArea = await this.areaModel.findByIdAndDelete(id).exec();
    if (!deletedArea) {
      throw new NotFoundException(`Area with id ${id} not found`);
    }
    return deletedArea;
  }
}