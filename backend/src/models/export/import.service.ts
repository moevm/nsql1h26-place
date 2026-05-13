import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Map, MapDocument } from '../maps/schemas/maps.schema';
import { MapObject, ObjectDocument } from '../objects/schemas/objects.schema';
import { Tag, TagDocument } from '../tags/schemas/tags.schema';
import { ExportData } from './export.service';

@Injectable()
export class ImportService {
  constructor(
    @InjectModel(Map.name) private mapModel: Model<MapDocument>,
    @InjectModel(MapObject.name) private objectModel: Model<ObjectDocument>,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async importFromJSON(jsonContent: string): Promise<void> {
    if (!this.isValidJSON(jsonContent)) {
      throw new BadRequestException('Неверный формат JSON файла');
    }
    try {
      const data = JSON.parse(jsonContent) as ExportData;
      await this.importData(data);
    } catch (error) {
      throw new BadRequestException(`Invalid JSON format: ${error.message}`);
    }
  }

  private async importData(data: ExportData): Promise<void> {
    try {
      await Promise.all([
        this.mapModel.deleteMany({}),
        this.objectModel.deleteMany({}),
        this.tagModel.deleteMany({}),
      ]);

      const preparedMaps = this.prepareMapsForImport(data.maps);
      const preparedObjects = this.prepareObjectsForImport(data.objects);
      const preparedTags = this.prepareTagsForImport(data.tags);

      try {
        await this.mapModel.insertMany(preparedMaps);
      } catch (error) {
        throw new BadRequestException(`Failed to insert maps: ${error.message}`);
      }
      try {
        await this.objectModel.insertMany(preparedObjects);
      } catch (error) {
        throw new BadRequestException(`Failed to insert objects: ${error.message}`);
      }
      try {
        await this.tagModel.insertMany(preparedTags);
      } catch (error) {
        throw new BadRequestException(`Failed to insert tags: ${error.message}`);
      }
    } catch (error) {
      throw new BadRequestException(`Failed to import data: ${error.message}`);
    }
  }

  private prepareMapsForImport(maps: any[]): any[] {
    return maps.map(map => {
      const { created_at, updated_at, ...cleanMap } = map;
      return cleanMap;
    });
  }

  private prepareObjectsForImport(objects: any[]): any[] {
    return objects.map(obj => {
      const { created_at, updated_at, ...cleanObj } = obj;
      return cleanObj;
    });
  }

  private prepareTagsForImport(tags: any[]): any[] {
    return tags.map(tag => {
      const { created_at, updated_at, ...cleanTag } = tag;
      return cleanTag;
    });
  }

  private isValidJSON(content: string): boolean {
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  }
}