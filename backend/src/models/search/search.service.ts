import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectType } from 'src/common/types/geojson.types';
import { SearchCategory, SearchResultItem } from 'src/common/types/search.types';
import { Map, MapDocument } from 'src/models/maps/schemas/maps.schema';
import { MapObject, ObjectDocument } from 'src/models/objects/schemas/objects.schema';

@Injectable()
export class SearchService {
  private readonly allCategories: SearchCategory[] = ['maps', 'points', 'routes', 'areas'];

  constructor(
    @InjectModel(Map.name) private readonly mapModel: Model<MapDocument>,
    @InjectModel(MapObject.name) private readonly objectModel: Model<ObjectDocument>,
  ) {}

  async search(query: string, rawCategories?: string | string[]): Promise<SearchResultItem[]> {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return [];
    }

    const regex = new RegExp(this.escapeRegExp(normalizedQuery), 'i');
    const categories = this.normalizeCategories(rawCategories);

    const categorySearches: Record<SearchCategory, () => Promise<SearchResultItem[]>> = {
      maps: () => this.searchMaps(regex),
      points: () => this.searchObjectsByType(regex, ObjectType.POINT, 'points'),
      routes: () => this.searchObjectsByType(regex, ObjectType.ROUTE, 'routes'),
      areas: () => this.searchObjectsByType(regex, ObjectType.AREA, 'areas'),
    };

    const tasks = this.allCategories
      .filter((category) => categories.has(category))
      .map((category) => categorySearches[category]());

    const groupedResults = await Promise.all(tasks);
    return groupedResults.flat();
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

  private async searchMaps(regex: RegExp): Promise<SearchResultItem[]> {
    const maps = await this.mapModel
      .find(
        {
          $or: [{ name: regex }, { description: regex }],
        },
        { _id: 1, name: 1, description: 1, image_path: 1 },
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
    }));
  }

  private async searchObjectsByType(
    regex: RegExp,
    type: ObjectType,
    category: Exclude<SearchCategory, 'maps'>,
  ): Promise<SearchResultItem[]> {
    const objects = await this.objectModel
      .find(
        {
          type,
          $or: [{ name: regex }, { description: regex }],
        },
        { _id: 1, map_id: 1, name: 1, description: 1, image_path: 1 },
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
    }));
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
