import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './schemas/routes.schema';

@Injectable()
export class RoutesService {
  constructor(@InjectModel(Route.name) private routeModel: Model<Route>) {}

  async create(route: CreateRouteDto): Promise<Route> {
    const createdRoute = new this.routeModel(route);
    return createdRoute.save();
  }

  async findAll(): Promise<Route[]> {
    return this.routeModel.find().exec();
  }

  async findOne(id: string) {
    return this.routeModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    return this.routeModel
      .findByIdAndUpdate({ _id: id }, updateRouteDto, { new: true })
      .exec();
  }

  async delete(id: string) {
    const deletedRoute = await this.routeModel.findByIdAndDelete({ _id: id }).exec();
    return deletedRoute;
  }
}
