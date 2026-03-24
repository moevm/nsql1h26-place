import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { MapObject, ObjectDocument } from './schemas/objects.schema';

@Injectable()
export class ObjectsService {
  constructor(@InjectModel(MapObject.name) private objectModel: Model<ObjectDocument>) {}

  async create(createObjectDto: CreateObjectDto): Promise<ObjectDocument> {
    const createdObject = new this.objectModel(createObjectDto);
    return createdObject.save();
  }

  async findAll(): Promise<ObjectDocument[]> {
    return this.objectModel.find().exec();
  }

  async findAllByType(typeParam: string): Promise<ObjectDocument[]> {
    if (!typeParam) {
      throw new BadRequestException('Invalid object type. Use points, areas, or routes');
    }

    return this.objectModel.find({ type: typeParam }).exec();
  }

  async findOne(id: string): Promise<ObjectDocument> {
    const object = await this.objectModel.findById(id).exec();
    if (!object) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }
    return object;
  }

  async update(id: string, updateObjectDto: UpdateObjectDto): Promise<ObjectDocument> {
    const updatedObject = await this.objectModel
      .findByIdAndUpdate(id, updateObjectDto, { new: true })
      .exec();

    if (!updatedObject) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }

    return updatedObject;
  }

  async delete(id: string): Promise<ObjectDocument> {
    const deletedObject = await this.objectModel.findByIdAndDelete(id).exec();
    if (!deletedObject) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }
    return deletedObject;
  }
}