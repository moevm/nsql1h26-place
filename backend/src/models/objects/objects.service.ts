import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { deleteByIdOrThrow, findByIdOrThrow, updateByIdOrThrow } from 'src/common/utils/crud.utils';
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
    return findByIdOrThrow(this.objectModel.findById(id).exec(), id, 'Object');
  }

  async update(id: string, updateObjectDto: UpdateObjectDto): Promise<ObjectDocument> {
    return updateByIdOrThrow(this.objectModel.findByIdAndUpdate(id, updateObjectDto, { new: true }).exec(), id, updateObjectDto, 'Object');
  }

  async delete(id: string): Promise<ObjectDocument> {
    return deleteByIdOrThrow(this.objectModel.findByIdAndDelete(id).exec(), id, 'Object');
  }
}