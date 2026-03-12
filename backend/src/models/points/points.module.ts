import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { Point, PointSchema } from './schemas/points.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Point.name, schema: PointSchema }])],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}