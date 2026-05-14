import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectType } from 'src/common/types/geojson.types';
import { SearchCategory, SearchResultItem } from 'src/common/types/search.types';
import { Map, MapDocument } from 'src/models/maps/schemas/maps.schema';
import { MapObject, ObjectDocument } from 'src/models/objects/schemas/objects.schema';

export type SearchFilters = {
  query?: string;
  nameQuery?: string;
  descriptionQuery?: string;
  tagsQuery?: string;
  dateFromDay?: number;
  dateToDay?: number;
  categories?: string | string[];
};

type NormalizedSearchFilters = {
  nameRegex?: RegExp;
  descriptionRegex?: RegExp;
  tagsRegex?: RegExp;
  fallbackRegex?: RegExp;
  createdAtRange?: {
    $gte?: Date;
    $lt?: Date;
  };
};

@Injectable()
export class SearchService {
  private readonly allCategories: SearchCategory[] = ['maps', 'points', 'routes', 'areas'];
  private readonly dayMs = 24 * 60 * 60 * 1000;

  constructor(
    @InjectModel(Map.name) private readonly mapModel: Model<MapDocument>,
    @InjectModel(MapObject.name) private readonly objectModel: Model<ObjectDocument>,
  ) {}

  async search(filters: SearchFilters): Promise<SearchResultItem[]> {
    const normalizedFilters = this.normalizeFilters(filters);
    if (!this.hasSearchFilters(normalizedFilters)) {
      return [];
    }

    const categories = this.normalizeCategories(filters.categories);

    const categorySearches: Record<SearchCategory, () => Promise<SearchResultItem[]>> = {
      maps: () => this.searchMaps(normalizedFilters),
      points: () => this.searchObjectsByType(normalizedFilters, ObjectType.POINT, 'points'),
      routes: () => this.searchObjectsByType(normalizedFilters, ObjectType.ROUTE, 'routes'),
      areas: () => this.searchObjectsByType(normalizedFilters, ObjectType.AREA, 'areas'),
    };

    const tasks = this.allCategories
      .filter((category) => categories.has(category))
      .map((category) => categorySearches[category]());

    const groupedResults = await Promise.all(tasks);
    return groupedResults.flat();
  }

  private normalizeFilters(filters: SearchFilters): NormalizedSearchFilters {
    const normalizedNameQuery = this.normalizeText(filters.nameQuery);
    const normalizedDescriptionQuery = this.normalizeText(filters.descriptionQuery);
    const normalizedTagsQuery = this.normalizeText(filters.tagsQuery);
    const normalizedLegacyQuery = this.normalizeText(filters.query);

    const shouldUseLegacyQuery =
      !normalizedNameQuery && !normalizedDescriptionQuery && !normalizedTagsQuery && !!normalizedLegacyQuery;

    return {
      nameRegex: normalizedNameQuery ? this.createRegex(normalizedNameQuery) : undefined,
      descriptionRegex: normalizedDescriptionQuery ? this.createRegex(normalizedDescriptionQuery) : undefined,
      tagsRegex: normalizedTagsQuery ? this.createRegex(normalizedTagsQuery) : undefined,
      fallbackRegex:
        shouldUseLegacyQuery && normalizedLegacyQuery
          ? this.createRegex(normalizedLegacyQuery)
          : undefined,
      createdAtRange: this.createCreatedAtRange(filters.dateFromDay, filters.dateToDay),
    };
  }

  private hasSearchFilters(filters: NormalizedSearchFilters): boolean {
    return Boolean(
      filters.nameRegex ||
        filters.descriptionRegex ||
        filters.tagsRegex ||
        filters.fallbackRegex ||
        filters.createdAtRange,
    );
  }

  private createCreatedAtRange(
    rawDateFromDay?: number,
    rawDateToDay?: number,
  ): { $gte?: Date; $lt?: Date } | undefined {
    const normalizedFromDay = this.normalizeDay(rawDateFromDay);
    const normalizedToDay = this.normalizeDay(rawDateToDay);

    if (normalizedFromDay === undefined && normalizedToDay === undefined) {
      return undefined;
    }

    const fromDay =
      normalizedFromDay !== undefined && normalizedToDay !== undefined
        ? Math.min(normalizedFromDay, normalizedToDay)
        : normalizedFromDay;
    const toDay =
      normalizedFromDay !== undefined && normalizedToDay !== undefined
        ? Math.max(normalizedFromDay, normalizedToDay)
        : normalizedToDay;

    const range: { $gte?: Date; $lt?: Date } = {};
    if (fromDay !== undefined) {
      range.$gte = new Date(fromDay * this.dayMs);
    }

    if (toDay !== undefined) {
      range.$lt = new Date((toDay + 1) * this.dayMs);
    }

    return range;
  }

  private normalizeDay(day?: number): number | undefined {
    if (typeof day !== 'number' || !Number.isFinite(day)) {
      return undefined;
    }

    const normalizedDay = Math.floor(day);
    if (normalizedDay < 0) {
      return undefined;
    }

    return normalizedDay;
  }

  private normalizeText(raw?: string): string {
    if (typeof raw !== 'string') {
      return '';
    }

    return raw.trim();
  }

  private createRegex(value: string): RegExp {
    return new RegExp(this.escapeRegExp(value), 'i');
  }

  private buildCommonMongoFilters(filters: NormalizedSearchFilters): Record<string, unknown> {
    const andConditions: Record<string, unknown>[] = [];

    if (filters.nameRegex) {
      andConditions.push({ name: filters.nameRegex });
    }

    if (filters.descriptionRegex) {
      andConditions.push({ description: filters.descriptionRegex });
    }

    if (filters.tagsRegex) {
      andConditions.push({ tags: filters.tagsRegex });
    }

    if (filters.fallbackRegex) {
      andConditions.push({
        $or: [
          { name: filters.fallbackRegex },
          { description: filters.fallbackRegex },
          { tags: filters.fallbackRegex },
        ],
      });
    }

    if (filters.createdAtRange) {
      andConditions.push({ created_at: filters.createdAtRange });
    }

    if (!andConditions.length) {
      return {};
    }

    if (andConditions.length === 1) {
      return andConditions[0];
    }

    return { $and: andConditions };
  }

  private normalizeCategories(rawCategories?: string | string[]): Set<SearchCategory> {
    if (!rawCategories) {
      return new Set(this.allCategories);
    }

    const values = Array.isArray(rawCategories) ? rawCategories : rawCategories.split(',');
    const parsedCategories = values
      .map((value) => value.trim().toLowerCase())
      .filter((value): value is SearchCategory => this.allCategories.includes(value as SearchCategory));

    if (!parsedCategories.length) {
      return new Set(this.allCategories);
    }

    return new Set(parsedCategories);
  }

  private async searchMaps(filters: NormalizedSearchFilters): Promise<SearchResultItem[]> {
    const mongoFilters = this.buildCommonMongoFilters(filters);
    const maps = await this.mapModel
      .find(
        mongoFilters,
        { _id: 1, name: 1, description: 1, image_path: 1, tags: 1 },
      )
      .limit(100)
      .lean()
      .exec();

    return maps.map((map): SearchResultItem => ({
      id: String(map._id),
      category: 'maps',
      title: map.name,
      description: map.description ?? '',
      map_id: null,
      image_path: map.image_path ?? '',
      tags: map.tags ?? [],
    }));
  }

  private async searchObjectsByType(
    filters: NormalizedSearchFilters,
    type: ObjectType,
    category: Exclude<SearchCategory, 'maps'>,
  ): Promise<SearchResultItem[]> {
    const mongoFilters = this.buildCommonMongoFilters(filters);
    const objects = await this.objectModel
      .find(
        {
          type,
          ...mongoFilters,
        },
        { _id: 1, map_id: 1, name: 1, description: 1, image_path: 1, tags: 1 },
      )
      .limit(100)
      .lean()
      .exec();

    return objects.map((item): SearchResultItem => ({
      id: String(item._id),
      category,
      title: item.name,
      description: item.description ?? '',
      map_id: item.map_id ? String(item.map_id) : null,
      image_path: item.image_path ?? '',
      tags: item.tags ?? [],
    }));
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
