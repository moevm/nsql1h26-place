import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Map, MapSchema } from 'src/models/maps/schemas/maps.schema';
import { MapObject, ObjectSchema } from 'src/models/objects/schemas/objects.schema';
import { TagsController } from './tags.controller';
import { Tag, TagSchema } from './schemas/tags.schema';
import { TagsService } from './tags.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: Map.name, schema: MapSchema },
      { name: MapObject.name, schema: ObjectSchema },
    ]),
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
