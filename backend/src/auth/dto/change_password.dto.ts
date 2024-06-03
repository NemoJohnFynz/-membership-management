import { IsNotEmpty, IsString } from "class-validator";


export class ChangePasswordDto{

    @IsNotEmpty()
    @IsString()
    readonly  OldPassword: string

    @IsNotEmpty()
    @IsString()
    readonly  NewPassword: string
}