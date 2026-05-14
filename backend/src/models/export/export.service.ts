import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Map, MapDocument } from '../maps/schemas/maps.schema';
import { MapObject, ObjectDocument } from '../objects/schemas/objects.schema';
import { Tag, TagDocument } from '../tags/schemas/tags.schema';

export interface ExportData {
  maps: object[];
  objects: object[];
  tags: object[];
  exportedAt: string;
  version: string;
}

@Injectable()
export class ExportService {
  constructor(
    @InjectModel(Map.name) private mapModel: Model<MapDocument>,
    @InjectModel(MapObject.name) private objectModel: Model<ObjectDocument>,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async exportForUser(userId: unknown): Promise<string> {
    const userObjectId = userId as Types.ObjectId;

    const maps = await this.mapModel
      .find({ user_id: userObjectId })
      .lean()
      .exec();

    const mapIds = maps.map((m) => m._id as Types.ObjectId);

    const [objects, tags] = await Promise.all([
      this.objectModel.find({ map_id: { $in: mapIds } }).lean().exec(),
      this.tagModel.find().lean().exec(),
    ]);

    const data: ExportData = {
      maps,
      objects,
      tags,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    return JSON.stringify(data, null, 2);
  }
}
