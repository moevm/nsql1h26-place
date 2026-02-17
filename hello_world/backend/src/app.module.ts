import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MapsModule } from './maps/maps.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI ?? ""),
        MapsModule
    ]
})

export class AppModule {}