import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { MapsModule } from './models/maps/maps.module';
import { ObjectsModule } from './models/objects/objects.module';
import { TagsModule } from './models/tags/tags.module';
import { SearchModule } from './models/search/search.module';
import { ExportImportModule } from './models/export/export-import.module';
import { StatisticsModule } from './models/statistics/statistics.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validationSchema: Joi.object({
                MONGO_URI: Joi.string().uri().required(),
                PORT: Joi.number().port().required(),
                NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
            }),
            validationOptions: { abortEarly: true },
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
            }),
        }),
        AuthModule,
        MapsModule,
        ObjectsModule,
        TagsModule,
        SearchModule,
        ExportImportModule,
        StatisticsModule,
    ],
})
export class AppModule {}