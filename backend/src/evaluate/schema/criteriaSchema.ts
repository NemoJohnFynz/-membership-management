

import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Criteria extends Document{

  @Prop({ type: [String], required: true })
  criteria: string;

  @Prop({ required: true , max: 10, min : 0})
  points: number;
}

export const CriteriaSchema = SchemaFactory.createForClass(Criteria);


// sub


// @Schema()
// export class Criterion {

//   @Prop({ required: true })
//   description: string;

//   @Prop({ required: true, min: 0, max: 10 })
//   points: number;
// }