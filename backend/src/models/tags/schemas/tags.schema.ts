import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema()
export class Tag {
  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 1,
    maxlength: 50,
    unique: true,
  })
  name: string;

  @Prop({ type: String, trim: true, maxlength: 255, default: '' })
  image_path: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
