// import { Controller , Post, UploadedFile, UseInterceptors, Get, Param, Res, Body, UseGuards } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import * as path from 'path';
// import * as fs from 'fs';
// import { AuthService } from '../auth/auth.service';
// import { AuthGuardD } from '../auth/guard/auth.guard';
// import { RolesGuard } from '../auth/guard/role.guard';
// import { JwtService } from '@nestjs/jwt';




// @Controller('avata')
// export class AvataController {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly jwtService: JwtService
//   ){}

//   @Post()
//   @UseInterceptors(FileInterceptor('avatar'))
//   async uploadFile(@UploadedFile() file, @Body('username') username: string) {
//     const filePath = path.join(__dirname, '..', 'uploads', file.filename);
//     const fileUrl = `http://localhost:4000/avata/images/${file.filename}`; // Tạo link ảnh (cần chỉnh sửa base URL tùy theo cấu hình)

//     // Gọi service để cập nhật link avatar
//     await this.authService.updateUserAvatar(username, fileUrl);

//     return { fileUrl };
//   }
  
//     @Get('images/:fileName')
//     async getImage(@Param('fileName') fileName: string, @Res() res) {
//       const imagePath = path.join(__dirname,'..', 'uploads', fileName);
  
//       // Check if the file exists
//       if (!fs.existsSync(imagePath)) {
//         return res.status(404).send('Image not found');
//       }
  
//       // Read the image file and send it to the client
//       res.sendFile(imagePath);
//     }


// }
