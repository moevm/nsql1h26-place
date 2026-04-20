import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { deleteByIdOrThrow, findByIdOrThrow, updateByIdOrThrow } from 'src/common/utils/crud.utils';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagDocument } from './schemas/tags.schema';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(createTagDto: CreateTagDto): Promise<TagDocument> {
    const createdTag = new this.tagModel(createTagDto);
    return createdTag.save();
  }

  async findAll(): Promise<TagDocument[]> {
    return this.tagModel.find().exec();
  }

  async findOne(id: string): Promise<TagDocument> {
    return findByIdOrThrow(this.tagModel.findById(id).exec(), id, 'Tag');
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<TagDocument> {
    return updateByIdOrThrow(this.tagModel.findByIdAndUpdate(id, updateTagDto, { new: true }).exec(), id, updateTagDto, 'Tag');
  }

  async delete(id: string): Promise<TagDocument> {
    return deleteByIdOrThrow(this.tagModel.findByIdAndDelete(id).exec(), id, 'Tag');
  }
}