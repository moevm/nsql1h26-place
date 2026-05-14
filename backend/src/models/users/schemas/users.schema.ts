import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, minlength: 3, maxlength: 30 })
  username: string;

  @Prop({ required: true, minlength: 1 })
  password_hash: string;

  @Prop({ index: true })
  auth_token: string;

  @Prop(String)
  image_path: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
