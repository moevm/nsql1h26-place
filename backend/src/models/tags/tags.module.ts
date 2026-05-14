import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { TagsController } from './tags.controller';
import { Tag, TagSchema } from './schemas/tags.schema';
import { TagsService } from './tags.service';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}