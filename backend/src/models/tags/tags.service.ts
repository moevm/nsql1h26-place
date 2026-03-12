import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<TagDocument> {
    const updatedTag = await this.tagModel.findByIdAndUpdate(id, updateTagDto, { new: true }).exec();
    if (!updatedTag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return updatedTag;
  }

  async delete(id: string): Promise<TagDocument> {
    const deletedTag = await this.tagModel.findByIdAndDelete(id).exec();
    if (!deletedTag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return deletedTag;
  }
}