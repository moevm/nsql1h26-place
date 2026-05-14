import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async importFromJSON(jsonContent: string, userId: unknown): Promise<void> {
    let data: ExportData;
    try {
      data = JSON.parse(jsonContent) as ExportData;
    } catch {
      throw new BadRequestException('Неверный формат JSON файла');
    }

    if (!data || !Array.isArray(data.maps) || !Array.isArray(data.objects)) {
      throw new BadRequestException('Файл не содержит корректных данных для импорта');
    }

    const userObjectId = new Types.ObjectId(String(userId));
    await this.replaceUserData(data, userObjectId);
  }

  private async replaceUserData(data: ExportData, userId: Types.ObjectId): Promise<void> {
    // Collect the map _ids from the imported file to know which objects belong to them
    const importedMapIds = (data.maps as any[]).map((m) => {
      try { return new Types.ObjectId(String(m._id)); } catch { return null; }
    }).filter(Boolean) as Types.ObjectId[];

    // Delete only current user's existing data
    const existingMapIds = await this.mapModel
      .find({ user_id: userId }, { _id: 1 })
      .lean()
      .exec()
      .then((docs) => docs.map((d) => d._id as Types.ObjectId));

    await Promise.all([
      this.mapModel.deleteMany({ user_id: userId }),
      this.objectModel.deleteMany({ map_id: { $in: existingMapIds } }),
    ]);

    // Prepare maps: force user_id to current user, cast _id to ObjectId
    const maps = (data.maps as any[]).map((m) => ({
      ...m,
      _id: new Types.ObjectId(String(m._id)),
      user_id: userId,
    }));

    // Prepare objects: cast _id and map_id to ObjectId
    const objects = (data.objects as any[]).map((obj) => ({
      ...obj,
      _id: new Types.ObjectId(String(obj._id)),
      map_id: new Types.ObjectId(String(obj.map_id)),
    }));

    // Insert maps first, then objects (objects reference maps)
    if (maps.length > 0) {
      await this.mapModel.insertMany(maps, { ordered: false }).catch((err) => {
        throw new BadRequestException(`Ошибка вставки карт: ${err.message}`);
      });
    }

    if (objects.length > 0) {
      await this.objectModel.insertMany(objects, { ordered: false }).catch((err) => {
        throw new BadRequestException(`Ошибка вставки объектов: ${err.message}`);
      });
    }

    // Tags: upsert by name (shared resource — don't delete other users' referenced tags)
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      await Promise.all(
        (data.tags as any[]).map((tag) =>
          this.tagModel
            .updateOne(
              { name: String(tag.name).toLowerCase().trim() },
              { $setOnInsert: { name: String(tag.name).toLowerCase().trim(), image_path: tag.image_path ?? '' } },
              { upsert: true },
            )
            .exec(),
        ),
      );
    }
  }
}
