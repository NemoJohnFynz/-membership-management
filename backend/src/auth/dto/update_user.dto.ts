
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto{

    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly born:string;
    
    @IsOptional()
    @IsString()
    readonly gender: string;

    @IsOptional()
    @IsString()
    readonly address: string;

}