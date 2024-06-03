import { Module } from '@nestjs/common';
import { EvaluateController } from './evaluate.controller';
import { EvaluateService } from './evaluate.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluate, EvaluateSchema } from './schema/evaluate.schema';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { UserEvaluationSchema,UserEvaluation } from './schema/userEvaluation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Evaluate.name, schema: EvaluateSchema  }]),
    MongooseModule.forFeature([{ name: UserEvaluation.name, schema: UserEvaluationSchema }]),
    AuthModule,
  ],
  controllers: [EvaluateController],
  providers: [EvaluateService,JwtService]
})
export class EvaluateModule {}

