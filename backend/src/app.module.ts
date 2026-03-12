import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { MapsModule } from './models/maps/maps.module';
import { RoutesModule } from './models/routes/routes.module';
import { PointsModule } from './models/points/points.module';
import { AreasModule } from './models/areas/areas.module';
import { TagsModule } from './models/tags/tags.module';

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
        RoutesModule,
        PointsModule,
        AreasModule,
        TagsModule,
    ],
})
export class AppModule {}