import { BadRequestException, Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { GoogleDriveService } from "./googleDrive.service";
import { FileInterceptor } from "@nestjs/platform-express";



@Controller('googledrive')
export class GoogleDriveController {
    constructor (
        private googleDriveService: GoogleDriveService,

         )
    {}

        @Post('upload')
        @UseInterceptors(FileInterceptor('file'))
        async uploadFile(@UploadedFile() file: Express.Multer.File) {
        try {
        if (!file) {
            throw new Error('File is required');
        }

        // Replace 'YOUR_FOLDER_ID' with the actual folder ID in Google Drive
        const folderId = '1WHhvSNA0eZasYfIo2ZZVKwLfN9q_CMiS';

        const imageUrl = await this.googleDriveService.uploadImage(file, folderId);
        return { imageUrl };
        } catch (error) {
        throw new Error('Failed to upload file');
        }
    }
}