import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ObjectType } from 'src/common/types/geojson.types';
import { Map, MapDocument } from 'src/models/maps/schemas/maps.schema';
import { MapObject, ObjectDocument } from 'src/models/objects/schemas/objects.schema';

export type StatisticsCategory = 'maps' | 'points' | 'routes' | 'areas';
export type StatisticsDataType = 'mine' | 'others';
export type StatisticsVisibility = 'public' | 'private';
export type StatisticsPeriod = 'day' | 'week' | 'month' | 'year';

export type StatisticsSummaryItem = {
  category: StatisticsCategory;
  count: number;
};

export type StatisticsFilters = {
  dataType: StatisticsDataType;
  visibility: StatisticsVisibility;
  period: StatisticsPeriod;
  categories: StatisticsCategory[];
  tags: string[];
};

export type StatisticsRawFilters = {
  dataType?: string;
  visibility?: string;
  period?: string;
  categories?: string | string[];
  tags?: string | string[];
};

@Injectable()
export class StatisticsService {
  private readonly allCategories: StatisticsCategory[] = ['maps', 'points', 'routes', 'areas'];
  private readonly dayMs = 24 * 60 * 60 * 1000;
  private readonly periodDays: Record<StatisticsPeriod, number> = {
    day: 1,
    week: 7,
    month: 30,
    year: 365,
  };

  constructor(
    @InjectModel(Map.name) private readonly mapModel: Model<MapDocument>,
    @InjectModel(MapObject.name) private readonly objectModel: Model<ObjectDocument>,
  ) {}

  normalizeFilters(raw: StatisticsRawFilters): StatisticsFilters {
    const dataType: StatisticsDataType = raw.dataType === 'others' ? 'others' : 'mine';
    const visibility: StatisticsVisibility = raw.visibility === 'private' ? 'private' : 'public';
    const period = this.normalizePeriod(raw.period);
    const tags = this.normalizeTags(raw.tags);

    return {
      dataType,
      visibility,
      period,
      categories: this.normalizeCategories(raw.categories),
      tags,
    };
  }

  async getSummary(filters: StatisticsFilters, userId: unknown): Promise<StatisticsSummaryItem[]> {
    if (filters.dataType === 'others' && filters.visibility === 'private') {
      return this.buildSummary(filters.categories, this.createEmptyCounts());
    }

    const userObjectId = this.toObjectId(userId);
    const baseMapFilter: Record<string, unknown> = this.buildMapFilter(filters, userObjectId);
    const createdAtRange = this.buildCreatedAtRange(filters.period);
    const counts = this.createEmptyCounts();

    if (filters.categories.includes('maps')) {
      const mapFilter = {
        ...baseMapFilter,
        created_at: createdAtRange,
        ...(filters.tags.length ? { tags: { $in: filters.tags } } : {}),
      };
      counts.maps = await this.mapModel.countDocuments(mapFilter).exec();
    }

    const objectCategories = filters.categories.filter((category) => category !== 'maps');
    if (objectCategories.length) {
      const mapIds = await this.mapModel.find(baseMapFilter, { _id: 1 }).lean().exec();
      if (mapIds.length) {
        const objectTypes = this.mapCategoriesToObjectTypes(objectCategories);
        const matchFilters: Record<string, unknown> = {
          map_id: { $in: mapIds.map((map) => map._id as Types.ObjectId) },
          type: { $in: objectTypes },
          created_at: createdAtRange,
        };

        if (filters.tags.length) {
          matchFilters.tags = { $in: filters.tags };
        }

        const aggregated = await this.objectModel
          .aggregate<{ _id: ObjectType; count: number }>([
            {
              $match: matchFilters,
            },
            { $group: { _id: '$type', count: { $sum: 1 } } },
          ])
          .exec();

        const typeToCategory: Record<ObjectType, StatisticsCategory> = {
          [ObjectType.POINT]: 'points',
          [ObjectType.ROUTE]: 'routes',
          [ObjectType.AREA]: 'areas',
        };

        aggregated.forEach((item) => {
          const category = typeToCategory[item._id];
          counts[category] = item.count;
        });
      }
    }

    return this.buildSummary(filters.categories, counts);
  }

  private normalizeCategories(raw?: string | string[]): StatisticsCategory[] {
    if (!raw) {
      return [...this.allCategories];
    }

    const values = Array.isArray(raw) ? raw : raw.split(',');
    const parsed = values
      .map((value) => value.trim().toLowerCase())
      .filter((value): value is StatisticsCategory =>
        this.allCategories.includes(value as StatisticsCategory),
      );

    if (!parsed.length) {
      return [...this.allCategories];
    }

    const unique = new Set(parsed);
    return this.allCategories.filter((category) => unique.has(category));
  }

  private normalizePeriod(raw?: string): StatisticsPeriod {
    if (!raw) {
      return 'week';
    }

    const normalized = raw.trim().toLowerCase();
    if (normalized === 'day' || normalized === 'week' || normalized === 'month' || normalized === 'year') {
      return normalized;
    }

    return 'week';
  }

  private normalizeTags(raw?: string | string[]): string[] {
    if (!raw) {
      return [];
    }

    const values = Array.isArray(raw) ? raw : raw.split(',');
    const normalized = values
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 0);

    return Array.from(new Set(normalized));
  }

  private buildMapFilter(filters: StatisticsFilters, userObjectId: Types.ObjectId): Record<string, unknown> {
    const mapFilter: Record<string, unknown> = {
      visible: filters.visibility === 'public',
    };

    if (filters.dataType === 'mine') {
      mapFilter.user_id = userObjectId;
    } else {
      mapFilter.user_id = { $ne: userObjectId };
    }

    return mapFilter;
  }

  private buildCreatedAtRange(period: StatisticsPeriod): { $gte: Date; $lte: Date } {
    const now = new Date();
    const days = this.periodDays[period] ?? 7;
    const from = new Date(now.getTime() - days * this.dayMs);

    return {
      $gte: from,
      $lte: now,
    };
  }

  private mapCategoriesToObjectTypes(categories: StatisticsCategory[]): ObjectType[] {
    const types: ObjectType[] = [];

    if (categories.includes('points')) {
      types.push(ObjectType.POINT);
    }

    if (categories.includes('routes')) {
      types.push(ObjectType.ROUTE);
    }

    if (categories.includes('areas')) {
      types.push(ObjectType.AREA);
    }

    return types;
  }

  private buildSummary(
    categories: StatisticsCategory[],
    counts: Record<StatisticsCategory, number>,
  ): StatisticsSummaryItem[] {
    const selected = new Set(categories);
    return this.allCategories
      .filter((category) => selected.has(category))
      .map((category) => ({
        category,
        count: counts[category] ?? 0,
      }));
  }

  private createEmptyCounts(): Record<StatisticsCategory, number> {
    return { maps: 0, points: 0, routes: 0, areas: 0 };
  }

  private toObjectId(value: unknown): Types.ObjectId {
    if (value instanceof Types.ObjectId) {
      return value;
    }

    return new Types.ObjectId(String(value));
  }
}
