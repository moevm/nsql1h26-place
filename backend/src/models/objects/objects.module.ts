import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { MapObject, ObjectSchema } from './schemas/objects.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MapObject.name, schema: ObjectSchema }])],
  controllers: [ObjectsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}