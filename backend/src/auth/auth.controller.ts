
import { Body, Controller, Post, Put, Req, UseGuards, 
  Param, UnauthorizedException, Get, NotFoundException, Request,
  UploadedFile, UseInterceptors,
  BadRequestException,
  Res, 
  Response
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from './schema/user.schema';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { ChangePasswordDto } from './dto/change_password.dto';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuardD } from './guard/auth.guard';

import { RolesGuard } from './guard/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { join } from 'path';
import { currentUser } from './decorator/currentUser.decorator';



@Controller('auth')
export class AuthController {
    constructor (
         private authService:AuthService,

         )
    {}

    @Post('register')
    signUP(@Body() registerDto:RegisterDto): Promise<User> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body()
    loginDto:LoginDto
):Promise<{ access_token, refreshtoken }>{
    return this.authService.login(loginDto)
}


@Get(':username')
@UseGuards(new RolesGuard(['0', '1']))
@UseGuards(AuthGuardD)

  async getUserByUsername(@Param('username') username: string): Promise<User> {
    try {
      const user = await this.authService.findUserByusername(username);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found in get username controller');
      }
      throw error; // Re-throw other errors
    }
  }


  @Post('current-user')
  @UseGuards(AuthGuardD)
  getcurrentUer(@currentUser() currentUser:User){
    return currentUser
  }

  

  @Put(':username')
  @UseGuards(new RolesGuard(['1', '0']))
  @UseGuards(AuthGuardD)
    async updateUser(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.authService.updateUser(username, updateUserDto);
    }

    @Post('changepassword/:username')
    @UseGuards(AuthGuardD)
    async changePassword(
      @Param('username') username: string,
      @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<void> {
      return this.authService.changePassword(username, changePasswordDto);
    }

    @Get()
    @UseGuards(new RolesGuard(['1', '0']))
     @UseGuards(AuthGuardD)
      async getallUser(){
        return this.authService.findAll()
      }

      @Put('activated/:username')
      @UseGuards(new RolesGuard(['0']))
      @UseGuards(AuthGuardD)
      async toggleUserActive(@Param('username') username: string) {
        console.log('it is Active account');
        return this.authService.toggleUserActive(username);
      }

      
    @Post('avata/:username')
    @UseGuards(new RolesGuard(['1', '0']))
    @UseGuards(AuthGuardD)
    @UseInterceptors(FileInterceptor('avatar'))
    async uploadFile(@UploadedFile() file, @Param('username') username: string) {
      const filePath = path.join(__dirname, '..', 'uploads', file.filename);
      const fileUrl = `http://localhost:4000/uploads/${username}_${file.originalname}`; // Sử dụng đường dẫn cố định với tên tệp hình ảnh
      // Gọi service để cập nhật link avatar
      await this.authService.updateUserAvatar(username, fileUrl);
      return { username, fileUrl,filePath };
    }

    @Get('images/:fileName')
  async getImage(@Param('fileName') fileName: string, @Res() res): Promise<void> {
    const imagePath = join(__dirname, '..', 'uploads', fileName);

    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      res.status(404).send('Image not found');
      return;
    }

    // Read the image file and send it to the client
    res.sendFile(imagePath);
  }
  

    // @Get('getImg/:username')
    // async getAvatar(@Param('username') username: string, @Res() res: any) {
    //   // Đường dẫn tới thư mục chứa hình ảnh avatar
    //   const avatarsDirectory = path.join(__dirname, '..', 'uploads');
    
    //   // Đường dẫn tới hình ảnh avatar của người dùng
    //   const avatarPath = path.join(avatarsDirectory, `${username}`);
    
    //   // Kiểm tra xem hình ảnh tồn tại hay không
    //   if (fs.existsSync(avatarPath)) {
    //     // Nếu hình ảnh tồn tại, gửi nó lại cho client
    //     res.sendFile(avatarPath);
    //   } else {
    //     // Nếu hình ảnh không tồn tại, gửi lại lỗi 404 Not Found
    //     res.status(404).send('Avatar not found');
    //   }
    // }


    // @Post('avata/:username')
    // @UseGuards(new RolesGuard(['1', '0']))
    // @UseGuards(AuthGuardD)
    // @UseInterceptors(FileInterceptor('avatar'))
    // async uploadFile(
    //   @UploadedFile() file: Express.Multer.File,
    //   @Param('username') username: string,
    // ) {
    //   const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    //   const fileUrl = `http://localhost:4000/avata/images/${file.filename}`; // Adjust base URL as needed
  
    //   // Call service to update the user's avatar link
    //   await this.authService.updateUserAvatar(username, fileUrl);
  
    //   return { fileUrl };
    // }
    
      

    // @Post('upload-avatar/:username')
    // @UseInterceptors(FileInterceptor('file'))
    // async uploadAvatar(
    //   @Param('username') username: string,
    //   @UploadedFile() file: Express.Multer.File,
    // ) {
    //   if (!file) {
    //     throw new BadRequestException('File is required');
    //   }
    //   const result = await this.authService.updateAvatar(username, file);
    //   return result;
    // }

}

//   @Put(':id')
//         async UpdateUser(
//             @Param('id')
//             id: string,
//             @Body()
//             data: User,
//         ):Promise<User>{
//             return this.authService.updateuser(id, data);
//         }


// @Get(':id')
// async getUser(
//     @Param('id')
//     id: string,
// ): Promise<User>{
// return this.authService.findUserByusername(id);
// }
    
    
    


// @Put(':id/update')
// @UseGuards(AuthGuard()) // Protect endpoint with JWT guard
// async updateUser(
//   @Req() req, // Access request object for authorization header
//   @Param('id') userId: string,
//   @Body() updateUserDto: UpdateUserDto,
// ): Promise<User> {
//     const userIdObjectId = new ObjectId(userId)
//   const user = await this.userService.getUserFromToken(req.headers.authorization); // Get user from token
//   if (!user._id.equals(userIdObjectId)) { // Check authorization (update only own user)
//     throw new UnauthorizedException('Unauthorized to update this user');
//   }
//   return await this.userService.updateUser(updateUserDto, userId);
// }

// @Put(':id')
//     @UseGuards(AuthGuard)
//     async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
//         return this.userService.updateUser(id, updateUserDto);
//     }

  

