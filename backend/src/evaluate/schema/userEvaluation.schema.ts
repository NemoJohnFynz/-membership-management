import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class UserEvaluation extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ type: Types.ObjectId, required: true })
  idEvaluate: Types.ObjectId;

  @Prop([
    {
        _id: { type: Types.ObjectId, required: true },
        criteria: { type: [String], required: true },
        points: { type: Number, required: true } // Đảm bảo trường points được định nghĩa và sử dụng đúng cách
    }
  ])
  criteria: {
      _id: Types.ObjectId;
      criteria: string[];
      points: number;
  }[];

  @Prop()
  result:boolean
}

export const UserEvaluationSchema = SchemaFactory.createForClass(UserEvaluation);
