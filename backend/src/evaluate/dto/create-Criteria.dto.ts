

import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateCriteriaDto {

  @IsArray()
  @IsString({ each: true })
  criteria: string;

  @IsNumber()
  points: number;
}
