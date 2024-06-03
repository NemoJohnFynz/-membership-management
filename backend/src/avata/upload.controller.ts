import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {

  
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    // Return the path of the stored file
    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    return { filePath };
  }

  @Get('images/:fileName')
  async getImage(@Param('fileName') fileName: string, @Res() res) {
    const imagePath = path.join(__dirname,'..', 'uploads', fileName);

    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image not found');
    }

    // Read the image file and send it to the client
    res.sendFile(imagePath);
  }
}
