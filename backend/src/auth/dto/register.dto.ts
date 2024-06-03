


import { IsNotEmpty, IsString, MinLength } from "class-validator";

// @Prop()
// username:string;

// @Prop()
// password:string;

// @Prop()
// name:string

// @Prop()
// gender:string;

// @Prop()
// born:Date;

// @Prop()
// address:string;

// @Prop()
// role: number;

// @Prop()
// avata:string; lúc đăng ký 0 cần avata =((

export class RegisterDto{


    @IsString()
    @IsNotEmpty()
    readonly username:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    readonly password: string

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly gender: string

    @IsString()
    @IsNotEmpty()
    readonly born: string

    @IsString()
    @IsNotEmpty()
    readonly address: string

    // @IsNotEmpty() role có thể không cần bắt buộc nhập khi đăng ký,role là auto
    readonly role: number

    // readonly refreshtoken:string // refresh token chỉ được thêm vào khi đăng nhập


}