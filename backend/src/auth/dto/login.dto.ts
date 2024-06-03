import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto{


    @IsNotEmpty()
    readonly username: string

    @IsNotEmpty()
    @IsString()
    readonly password: string
}