import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExportService } from './export.service';
import { ImportService } from './import.service';
import { ExportImportController } from './export-import.controller';
import { Map, MapSchema } from '../maps/schemas/maps.schema';
import { MapObject, ObjectSchema } from '../objects/schemas/objects.schema';
import { Tag, TagSchema } from '../tags/schemas/tags.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Map.name, schema: MapSchema },
      { name: MapObject.name, schema: ObjectSchema },
      { name: Tag.name, schema: TagSchema },
    ]),
  ],
  controllers: [ExportImportController],
  providers: [ExportService, ImportService],
  exports: [ExportService, ImportService],
})
export class ExportImportModule {}
