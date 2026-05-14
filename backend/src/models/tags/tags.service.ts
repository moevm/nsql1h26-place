import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { deleteByIdOrThrow, findByIdOrThrow, updateByIdOrThrow } from 'src/common/utils/crud.utils';
import { Map, MapDocument } from 'src/models/maps/schemas/maps.schema';
import { MapObject, ObjectDocument } from 'src/models/objects/schemas/objects.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagDocument } from './schemas/tags.schema';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @InjectModel(Map.name) private mapModel: Model<MapDocument>,
    @InjectModel(MapObject.name) private objectModel: Model<ObjectDocument>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<TagDocument> {
    const createdTag = new this.tagModel(createTagDto);
    return createdTag.save();
  }

  async findAll(search?: string): Promise<TagDocument[]> {
    const filter = search
      ? { name: new RegExp(this.escapeRegExp(search.trim()), 'i') }
      : {};
    return this.tagModel.find(filter).sort({ name: 1 }).limit(50).exec();
  }

  async findOne(id: string): Promise<TagDocument> {
    return findByIdOrThrow(this.tagModel.findById(id).exec(), id, 'Tag');
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<TagDocument> {
    const existing = await findByIdOrThrow<TagDocument>(this.tagModel.findById(id).exec(), id, 'Tag');

    if (updateTagDto.name && updateTagDto.name.trim().toLowerCase() !== existing.name) {
      const oldName = existing.name;
      const newName = updateTagDto.name.trim().toLowerCase();
      await Promise.all([
        this.mapModel.updateMany({ tags: oldName }, { $set: { 'tags.$': newName } }).exec(),
        this.objectModel.updateMany({ tags: oldName }, { $set: { 'tags.$': newName } }).exec(),
      ]);
    }

    return updateByIdOrThrow(
      this.tagModel.findByIdAndUpdate(id, updateTagDto, { new: true }).exec(),
      id,
      updateTagDto,
      'Tag',
    );
  }

  async delete(id: string): Promise<TagDocument> {
    const existing = await findByIdOrThrow<TagDocument>(this.tagModel.findById(id).exec(), id, 'Tag');
    const name = existing.name;

    await Promise.all([
      this.mapModel.updateMany({ tags: name }, { $pull: { tags: name } }).exec(),
      this.objectModel.updateMany({ tags: name }, { $pull: { tags: name } }).exec(),
    ]);

    return deleteByIdOrThrow(this.tagModel.findByIdAndDelete(id).exec(), id, 'Tag');
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
