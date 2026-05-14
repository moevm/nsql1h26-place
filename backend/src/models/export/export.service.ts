import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Map, MapDocument } from '../maps/schemas/maps.schema';
import { MapObject, ObjectDocument } from '../objects/schemas/objects.schema';
import { Tag, TagDocument } from '../tags/schemas/tags.schema';

export type ExportFormat = 'json';

export interface ExportData {
  maps: MapDocument[];
  objects: ObjectDocument[];
  tags: TagDocument[];
  exportedAt: string;
  version: string;
}

@Injectable()
export class ExportService {
  constructor(
    @InjectModel(Map.name) private mapModel: Model<MapDocument>,
    @InjectModel(MapObject.name) private objectModel: Model<ObjectDocument>,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) { }

  // Получить все данные приложения
  async getAllData(): Promise<ExportData> {
    const [maps, objects, tags] = await Promise.all([
      this.mapModel.find().select('-created_at -updated_at').lean().exec(),
      this.objectModel.find().select('-created_at -updated_at').lean().exec(),
      this.tagModel.find().lean().exec(),
    ]);

    return {
      maps: maps as MapDocument[],
      objects: objects as ObjectDocument[],
      tags: tags as TagDocument[],
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  // Экспортировать данные в JSON
  async exportToJSON(data: ExportData): Promise<string> {
    return JSON.stringify(data, null, 2);
  }
}
