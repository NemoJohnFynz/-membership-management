
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document,Types } from 'mongoose';
import { Criteria,CriteriaSchema } from "./criteriaSchema";
import { Type } from "class-transformer";
import { User } from "../../auth/schema/user.schema";

@Schema({
    timestamps: true
})
export class Evaluate extends Document { // Mở rộng từ Document

    @Prop({ required: true })
    title: string;

    @Prop({ type: [Criteria] })
    @Type(() => Criteria)
    criteria: Criteria[];

    @Prop({ default: 100, max:100, min:0 })
    totalPoints: number;

    @Prop({ default: false })
    isSubmitted: boolean;

    @Prop({ type: [Types.ObjectId], ref: 'User' })
    completedBy: User[];
  
    @Prop({ type: Types.ObjectId, ref: 'User' })
    reviewedBy: Types.ObjectId; // Admin duyệt kết quả
  
    @Prop({ default: false })
    isApproved: boolean; // Trạng thái duyệt
}

export const EvaluateSchema = SchemaFactory.createForClass(Evaluate);


// @Prop({ required: true })
// title: string;

// @Prop({ type: [CriterionSchema], required: true })
// criteria: Types.Array<Criterion>;

// @Prop({ required: true })
// totalPoints: number;
// }