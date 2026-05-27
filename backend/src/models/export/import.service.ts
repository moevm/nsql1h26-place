import { Injectable, BadRequestException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Map as MapEntity, MapDocument, } from '../maps/schemas/maps.schema';
import { MapObject, ObjectDocument, } from '../objects/schemas/objects.schema';
import { Tag, TagDocument, } from '../tags/schemas/tags.schema';
import { ExportData } from './export.service';

@Injectable()
export class ImportService {
  constructor(
    @InjectModel(MapEntity.name)
    private mapModel: Model<MapDocument>,

    @InjectModel(MapObject.name)
    private objectModel: Model<ObjectDocument>,

    @InjectModel(Tag.name)
    private tagModel: Model<TagDocument>,
  ) { }

  async importFromJSON(jsonContent: string, userId: unknown,): Promise<void> {
    let data: ExportData;

    try {
      data = JSON.parse(jsonContent) as ExportData;
    } catch {
      throw new BadRequestException(
        'Неверный формат JSON файла',
      );
    }

    if (!data || !Array.isArray(data.maps) || !Array.isArray(data.objects)) {
      throw new BadRequestException(
        'Файл не содержит корректных данных для импорта',
      );
    }

    const userObjectId = new Types.ObjectId(
      String(userId),
    );

    await this.replaceUserData(
      data,
      userObjectId,
    );
  }

  private sanitizeMongoDoc<T extends Record<string, any>>(doc: T,): Omit<T, '_id' | '__v' | 'created_at' | 'updated_at'> {
    const { _id, __v, created_at, updated_at, ...clean } = doc;
    return clean;
  }

  private async replaceUserData(data: ExportData, userId: Types.ObjectId,): Promise<void> {
    try {
      const mapIdMap = new global.Map<string, Types.ObjectId>();
      const maps = data.maps.map(
        (mapData: any) => {
          const cleanMap = this.sanitizeMongoDoc(mapData,);
          const oldMapId = String(mapData._id,);
          const newMapId = new Types.ObjectId();
          mapIdMap.set(oldMapId, newMapId,);
          return { ...cleanMap, _id: newMapId, user_id: userId, };
        },
      );

      const objects = data.objects.map(
        (objectData: any) => {
          const cleanObject = this.sanitizeMongoDoc(objectData,);
          const oldMapId = String(objectData.map_id,);
          const newMapId = mapIdMap.get(oldMapId);
          if (!newMapId) {
            throw new Error(`Map mapping not found for object: ${objectData.name}`,);
          }
          return { ...cleanObject, _id: new Types.ObjectId(), map_id: newMapId, };
        },
      );

      if (maps.length > 0) {
        await this.mapModel.insertMany(maps,);
      }

      if (objects.length > 0) {
        await this.objectModel.insertMany(objects,);
      }

      if (Array.isArray(data.tags)) {
        await Promise.all(
          data.tags.map(
            async (tag: any) => {
              const tagName = String(tag.name,).toLowerCase().trim();
              await this.tagModel.updateOne({ name: tagName, }, { $setOnInsert: { name: tagName, image_path: tag.image_path ?? '', }, }, { upsert: true, },);
            },
          ),
        );
      }
    } catch {
      throw new BadRequestException('Ошибка импорта данных',);
    }
  }
}