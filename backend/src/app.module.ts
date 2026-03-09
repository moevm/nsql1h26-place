import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MapsModule } from './maps/maps.module';
import { RoutesModule } from './routes/routes.module';

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
        MapsModule,
        RoutesModule,
    ],
})
export class AppModule {}