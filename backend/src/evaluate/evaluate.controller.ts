import { Body, InternalServerErrorException, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { EvaluateService } from './evaluate.service';
import { CreateEvaluateDto } from './dto/create-evaluate.dto';
import { AuthGuardD } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { JwtService } from '@nestjs/jwt';
import { CreateUserEvaluationDto } from './dto/user-evaluation.dto';
import { UserEvaluation } from './schema/userEvaluation.schema';
import { User } from '../auth/schema/user.schema';
import { currentUser } from '../auth/decorator/currentUser.decorator';
import { Evaluate } from './schema/evaluate.schema';

@Controller('evaluate')
export class EvaluateController {

    constructor(
      private readonly evaluateService: EvaluateService,
      private readonly jwtService: JwtService
    ) {}

  @Post('create-evaluate')
  @UseGuards(new RolesGuard(['0']))
  @UseGuards(AuthGuardD)
  async createEvaluation(@Body() CreateEvaluateDto: CreateEvaluateDto) {
    return this.evaluateService.createEvaluation(CreateEvaluateDto);
  }

  // @Put(':id/approve')
  // async approveEvaluation(@Param('id') id: string) {
  //   return this.evaluateService.approveEvaluation(id);
  // }

  @Get('Evaluate/:id')
    async getEvaluationById(@Param('id') id: string): Promise<Evaluate> {
        try {
            const evaluation = await this.evaluateService.getEvaluationById(id);
            return evaluation;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Evaluation not found');
            }
            throw error;
        }
    }

  @Post('userEvaluate/:idEvaluate')
  @UseGuards(new RolesGuard(['1', '0']))
  @UseGuards(AuthGuardD)
  async create(
    @Param('idEvaluate') idEvaluate: string,
    @Body() createUserEvaluationDto: CreateUserEvaluationDto,
    @currentUser() user: User
  ) {
    const username = user.username;
    const createdUserEvaluation = await this.evaluateService.create(createUserEvaluationDto, username, idEvaluate);
    return createdUserEvaluation;
  }
  
  @Patch(':id/approve')
  async approveEvaluation(@Param('id') id: string): Promise<void> {
      try {
          await this.evaluateService.approveEvaluation(id);
      } catch (error) {
          console.error(`Error in approveEvaluation controller for ID ${id}:`, error.message);
          throw new HttpException('Evaluation approval failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @Put(':id/reject')
async rejectEvaluation(
    @Param('id') id: string,
    @Body('username') username: string
): Promise<{ status: number; message: string }> {
    try {
        return await this.evaluateService.rejectEvaluation(id, username);
    } catch (error) {
        if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message);
        } else {
            throw new InternalServerErrorException('Error rejecting evaluation');
        }
    }
}

  @Get('getEva')
  async findAllEva(): Promise<Evaluate[]> {
    return this.evaluateService.findAllEvaluate();
  }

  @Get('userEvaluate')
  async findAll(): Promise<UserEvaluation[]> {
    return this.evaluateService.findAll();
  }

  @Get('userEvaluate/:id')
  async findById(@Param('id') id: string): Promise<UserEvaluation> {
    return this.evaluateService.findById(id);
  }

  @Get('completedBy/:id')
  async getCompletedByById(@Param('id') id: string): Promise<User[]> {
    return this.evaluateService.getCompletedByById(id);
  }

  @Get('getByIdevaluate/:id')
  async findEvaluateId(@Param('id') id: string): Promise<Evaluate> {
    return this.evaluateService.findEvaluatebyid(id);
  }
    
}
