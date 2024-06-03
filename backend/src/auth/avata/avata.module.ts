import { Module } from '@nestjs/common';

import { diskStorage } from 'multer';
import * as path from 'path';
import { MulterModule } from '@nestjs/platform-express';



@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Thư mục lưu trữ file
        filename: (req, file, cb) => {
          const filename = `${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),

  ],
  controllers: [],
  exports: []

})
export class AvataModule {}
