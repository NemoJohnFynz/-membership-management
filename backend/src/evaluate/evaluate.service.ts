import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Evaluate } from './schema/evaluate.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEvaluateDto } from './dto/create-evaluate.dto';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/schema/user.schema';
import { UserEvaluation } from './schema/userEvaluation.schema';
import { CreateUserEvaluationDto } from './dto/user-evaluation.dto';

@Injectable()
export class EvaluateService {
    constructor(
        @InjectModel(Evaluate.name) private readonly evaluateModel: Model<Evaluate>,
        @InjectModel(UserEvaluation.name) private readonly userEvaluationModel: Model<UserEvaluation>,
        private readonly authService: AuthService,
    ) {}

    async createEvaluation(createEvaluationDto: CreateEvaluateDto): Promise<Evaluate> {
        const createdEvaluation = new this.evaluateModel(createEvaluationDto);
        return createdEvaluation.save();
    }

    async getEvaluationById(id: string): Promise<Evaluate> {
        const evaluation = await this.evaluateModel.findById(id).exec();
        if (!evaluation) {
            throw new NotFoundException('Evaluation not found');
        }
        return evaluation;
    }

    async findAllEvaluate(): Promise<Evaluate[]> {
      return this.evaluateModel.find().exec();
    }
    
    async submitEvaluation(id: string, username: string): Promise<Evaluate> {
      const evaluation = await this.getEvaluationById(id);
      const user = await this.authService.findUserByusername(username); // Lấy thông tin user
      if (evaluation.completedBy.includes(user.username) ) {
          throw new Error('You have already completed this evaluation.');
      }
      evaluation.completedBy.push(user.username);
      evaluation.isSubmitted = true;
      return evaluation.save();
  }

  async removeUserFromEvaluation(idEvaluate: string, username: string): Promise<Evaluate> {
    const evaluation = await this.evaluateModel.findById(idEvaluate);
    const user = await this.authService.findUserByusername(username);
    const userIndex = evaluation.completedBy.indexOf(user.username);

    if (userIndex === -1) {
        throw new Error('This user has not completed this evaluation.');
    }

    evaluation.completedBy.splice(userIndex, 1); // Xoá username khỏi completedBy
    return evaluation.save();
}

async rejectEvaluation(idEvaluate: string, username: string): Promise<{ status: number; message: string }> {
    try {
        console.log(`Updating evaluation result for Evaluate ID ${idEvaluate}`);

        const updateResult = await this.userEvaluationModel.findOneAndUpdate(
            { idEvaluate, username },
            { $set: { result: false } },
            { new: true } // Trả về tài liệu đã được cập nhật
        );

        if (!updateResult) {
            console.error(`No user evaluation found with Evaluate ID ${idEvaluate} and Username ${username}`);
            throw new NotFoundException('User evaluation not found');
        } else {
            console.log(`Successfully updated evaluation result for Evaluate ID ${idEvaluate}`);
            
            // Gọi hàm removeUserFromEvaluation để xoá username khỏi completedBy
            await this.removeUserFromEvaluation(idEvaluate, username);
            return { status: 200, message: 'Evaluation rejected and user removed successfully' };
        }
    } catch (error) {
        console.error(`Error updating evaluation result for Evaluate ID ${idEvaluate}:`, error);
        throw new InternalServerErrorException('Error updating evaluation result');
    }
}




  // async approveEvaluation(id: string): Promise<Evaluate> {
  //   const evaluation = await this.getEvaluationById(id);
  //   evaluation.isApproved = true;

  //   for (const username of evaluation.completedBy) {
  //     await this.authService.updateIsMember(user.username, true);
  //   }

  //   // Save the updated evaluation to the database
  //   // Assuming you have a save method in your repository
  //   return evaluation;
  // }



  async approveEvaluation(id: string): Promise<{ status: number; message: string }> {
    try {
        console.log(`Updating evaluation result for ID ${id}`);
        
        const updateResult = await this.userEvaluationModel.findByIdAndUpdate(
            id,
            { $set: { result: true } },
            { new: true } // Trả về tài liệu đã được cập nhật
        );

        if (!updateResult) {
            console.error(`No evaluation found with ID ${id}`);
            throw new NotFoundException('Evaluation not found');
        } else {
            console.log(`Successfully updated evaluation result for ID ${id}`);
            return { status: 200, message: 'Evaluation approved successfully' };
        }
    } catch (error) {
        console.error(`Error updating evaluation result for ID ${id}:`, error);
        throw new InternalServerErrorException('Error updating evaluation result');
    }
}



    // async rejectEvaluation(id: string): Promise<Evaluate> {
    //     const evaluation = await this.getEvaluationById(id);
    //     evaluation.isApproved = false;
    //     // Logic yêu cầu user làm lại
    //     return evaluation.save();
    // }
  
    async create(createUserEvaluationDto: CreateUserEvaluationDto, username: string, evaluationId: string): Promise<UserEvaluation> {
      // Kiểm tra xem username đã tồn tại với idEvaluate đã cho hay chưa
      const existingUserEvaluation = await this.userEvaluationModel.findOne({ evaluationId, username }).exec();
      if (existingUserEvaluation) {
          throw new NotFoundException('Bản đánh giá này đã được gửi bởi người dùng này trước đó.');
      }
  
      // Nếu không tìm thấy bản ghi, tạo mới một bản ghi UserEvaluation trong database
      const createdUserEvaluation = new this.userEvaluationModel({ ...createUserEvaluationDto, evaluationId });
      const savedUserEvaluation = await createdUserEvaluation.save();
  
      // Sau khi đã tạo bản ghi UserEvaluation, thực hiện cập nhật trạng thái Evaluate
      await this.submitEvaluation(evaluationId, username);
      return savedUserEvaluation;
    }  

    async findAll(): Promise<UserEvaluation[]> {
      return this.userEvaluationModel.find().exec();
    }

    async findEvaluatebyid(id: string): Promise<Evaluate> {
      const Evaluation = await this.evaluateModel.findById(id).exec();
      if (!Evaluation) {
        throw new NotFoundException('User evaluation not found');
      }
      return Evaluation;
    }

    async findById(id: string): Promise<UserEvaluation> {
      const userEvaluation = await this.userEvaluationModel.findById(id).exec();
      if (!userEvaluation) {
        throw new NotFoundException('User evaluation not found');
      }
      return userEvaluation;
    }

    async getCompletedByById(id: string): Promise<User[]> {
        const evaluation = await this.evaluateModel.findById(id).select('completedBy').lean().exec();
        if (!evaluation) {
            throw new NotFoundException('Evaluation not found');
        }
        return evaluation.completedBy;
    }
    
}
