import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Map, MapSchema } from 'src/models/maps/schemas/maps.schema';
import { MapObject, ObjectSchema } from 'src/models/objects/schemas/objects.schema';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Map.name, schema: MapSchema },
      { name: MapObject.name, schema: ObjectSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
