// //1. Xây dựng trang đăng ký: tên đăng nhập, mật khẩu, họ tên, giới tính, năm sinh, quê quán.

// 2. Xây dựng chức năng đăng nhập cho user

// 3. Sau khi đăng nhập sẽ chuyển đến trang hiển thị thông tin user

// (Lưu ý: UI có thể lấy từ internet)

import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types,Document } from "mongoose";

@Schema({
    timestamps: true
})

export class User extends Document  {


    @Prop({unique: [true, 'username is exit please change your username :(']})
    username:string;

    @Prop()
    password:string;

    @Prop()
    name:string

    @Prop()
    gender:string;

    @Prop()
    born:string;

    @Prop()
    address:string;

    @Prop({default: 1}) //auto user = 1
    role: number;

    @Prop({default:"http://localhost:4000/uploads/image.png"})
    avatar:string; 

    @Prop()
    refreshtoken: string;

    @Prop({ default: false }) // Mặc định là kích hoạt
    isActive: boolean;

    @Prop({default: false})// mặc định là 0 phải member
    isMember: boolean;

    @Prop({ type: [Types.ObjectId], ref: 'Evaluate' })
    completedEvaluations: Types.ObjectId[];

    @Prop({ default: 0 })
    rejectionCount: number; // Thêm trường này để đếm số lần bị từ chối
}


export const UserSchema =SchemaFactory.createForClass(User)