import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { type GeoJSONGeometry, ObjectType } from 'src/common/types/geojson.types';
import { deleteByIdOrThrow, findByIdOrThrow, updateByIdOrThrow } from 'src/common/utils/crud.utils';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { MapObject, ObjectDocument } from './schemas/objects.schema';

@Injectable()
export class ObjectsService {
  constructor(@InjectModel(MapObject.name) private objectModel: Model<ObjectDocument>) {}

  async create(createObjectDto: CreateObjectDto): Promise<ObjectDocument> {
    if (createObjectDto.type === ObjectType.ROUTE) {
      this.validateRouteGeometry(createObjectDto.location);
    }

    const createdObject = new this.objectModel(createObjectDto);
    return createdObject.save();
  }

  async findAll(page = 1): Promise<ObjectDocument[]> {
    const pageNumber = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const limit = 10;
    return this.objectModel
      .find()
      .sort({ created_at: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findAllByType(typeParam: ObjectType, page = 1): Promise<ObjectDocument[]> {
    if (!typeParam) {
      throw new BadRequestException('Invalid object type. Use points, areas, or routes');
    }

    const pageNumber = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const limit = 10;

    return this.objectModel
      .find({ type: typeParam })
      .sort({ created_at: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<ObjectDocument> {
    return findByIdOrThrow(this.objectModel.findById(id).exec(), id, 'Object');
  }

  async update(id: string, updateObjectDto: UpdateObjectDto): Promise<ObjectDocument> {
    const existingObject = await findByIdOrThrow(this.objectModel.findById(id).exec(), id, 'Object');

    if (existingObject.type === ObjectType.ROUTE && updateObjectDto.location) {
      throw new BadRequestException('Route geometry cannot be changed after creation');
    }

    return updateByIdOrThrow(this.objectModel.findByIdAndUpdate(id, updateObjectDto, { new: true }).exec(), id, updateObjectDto, 'Object');
  }

  private validateRouteGeometry(location: GeoJSONGeometry | undefined): void {
    if (!location || location.type !== 'LineString') {
      throw new BadRequestException('Route location must be a valid LineString');
    }

    if (location.coordinates.length < 2) {
      throw new BadRequestException('Route must contain at least 2 waypoints');
    }

    const hasInvalidWaypoint = location.coordinates.some(
      (waypoint) =>
        !Array.isArray(waypoint) ||
        waypoint.length < 2 ||
        !Number.isFinite(waypoint[0]) ||
        !Number.isFinite(waypoint[1]),
    );

    if (hasInvalidWaypoint) {
      throw new BadRequestException('Each route waypoint must contain valid latitude and longitude');
    }
  }

  async delete(id: string): Promise<ObjectDocument> {
    return deleteByIdOrThrow(this.objectModel.findByIdAndDelete(id).exec(), id, 'Object');
  }
}