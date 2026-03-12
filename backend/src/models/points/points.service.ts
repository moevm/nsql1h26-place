import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Point, PointDocument } from './schemas/points.schema';

@Injectable()
export class PointsService {
  constructor(@InjectModel(Point.name) private pointModel: Model<PointDocument>) {}

  async create(createPointDto: CreatePointDto): Promise<PointDocument> {
    const createdPoint = new this.pointModel(createPointDto);
    return createdPoint.save();
  }

  async findAll(): Promise<PointDocument[]> {
    return this.pointModel.find().exec();
  }

  async findOne(id: string): Promise<PointDocument> {
    const point = await this.pointModel.findById(id).exec();
    if (!point) {
      throw new NotFoundException(`Point with id ${id} not found`);
    }
    return point;
  }

  async update(id: string, updatePointDto: UpdatePointDto): Promise<PointDocument> {
    const updatedPoint = await this.pointModel
      .findByIdAndUpdate(id, { ...updatePointDto, updated_at: new Date() }, { new: true })
      .exec();

    if (!updatedPoint) {
      throw new NotFoundException(`Point with id ${id} not found`);
    }

    return updatedPoint;
  }

  async delete(id: string): Promise<PointDocument> {
    const deletedPoint = await this.pointModel.findByIdAndDelete(id).exec();
    if (!deletedPoint) {
      throw new NotFoundException(`Point with id ${id} not found`);
    }
    return deletedPoint;
  }
}