import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true}) 
   _id: Types.ObjectId;

  @Prop({ unique: true })
  userAddress: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ unique: true })
  userName: string;

  @Prop({ default: null })
  email: string;

  @Prop({ default: null })
  password: string;

  @Prop({ 
    required: true,
    enum: ['wallet', 'social']
   })
  loginOption: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
