import { IsString, IsArray, IsNumber, IsDate, ValidateNested, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCriteriaDto } from './create-Criteria.dto';
import { Document } from 'mongoose';


export class CreateEvaluateDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCriteriaDto)
  criteria: CreateCriteriaDto[];

  @IsNumber()
  @Min(10)
  @Max(100)
  totalPoints: number;

  
}
