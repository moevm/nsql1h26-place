import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema()
export class Tag {
  @Prop({ type: String, required: true, maxlength: 100 })
  name: string;

  @Prop({ type: String, maxlength: 255, default: '' })
  image_path: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
