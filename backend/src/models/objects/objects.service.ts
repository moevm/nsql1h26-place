import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { type GeoJSONGeometry, ObjectType } from 'src/common/types/geojson.types';
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

  async findAll(): Promise<ObjectDocument[]> {
    return this.objectModel.find().exec();
  }

  async findAllByType(typeParam: string): Promise<ObjectDocument[]> {
    if (!typeParam) {
      throw new BadRequestException('Invalid object type. Use points, areas, or routes');
    }

    return this.objectModel.find({ type: typeParam }).exec();
  }

  async findOne(id: string): Promise<ObjectDocument> {
    const object = await this.objectModel.findById(id).exec();
    if (!object) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }
    return object;
  }

  async update(id: string, updateObjectDto: UpdateObjectDto): Promise<ObjectDocument> {
    const existingObject = await this.objectModel.findById(id).exec();
    if (!existingObject) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }

    if (existingObject.type === ObjectType.ROUTE && updateObjectDto.location) {
      throw new BadRequestException('Route geometry cannot be changed after creation');
    }

    const updatedObject = await this.objectModel
      .findByIdAndUpdate(id, updateObjectDto, { new: true })
      .exec();

    if (!updatedObject) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }

    return updatedObject;
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
    const deletedObject = await this.objectModel.findByIdAndDelete(id).exec();
    if (!deletedObject) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }
    return deletedObject;
  }
}