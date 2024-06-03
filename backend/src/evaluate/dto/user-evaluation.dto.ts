import { IsString, IsArray, IsNotEmpty,IsNumber, Min, Max  } from "class-validator";

export class CreateUserEvaluationDto {

 @IsNotEmpty()
  readonly idEvaluate: string;

  @IsString()
  readonly username: string;

  @IsArray()
  readonly criteria: {
    
      _id: string; // Sẽ tham chiếu đến idEvaluate
      criteria: string[];
      
      
      points: number
    };
  }[];


//   import { IsString, IsArray, IsNotEmpty, } from "class-validator";

// export class CreateUserEvaluationDto {
//   @IsNotEmpty()
//   readonly idEvaluate: string;

//   @IsString()
//   readonly username: string;

//   @IsArray()
//   @IsNotEmpty({ each: true })
//   readonly criteria: {
//     _id: string; // Will reference idEvaluate
//     @IsArray()
//     @IsString({ each: true })
//     criteria: string[];
    
//     @IsNumber()
//     @Min(0)
//     @Max(10)
//     points: number;
//   }[];
// }
