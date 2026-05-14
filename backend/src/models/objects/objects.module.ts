import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Map, MapSchema } from 'src/models/maps/schemas/maps.schema';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { MapObject, ObjectSchema } from './schemas/objects.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: MapObject.name, schema: ObjectSchema },
      { name: Map.name, schema: MapSchema },
    ]),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}
