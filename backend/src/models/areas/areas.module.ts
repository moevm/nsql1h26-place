import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { Area, AreaSchema } from './schemas/areas.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }])],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}