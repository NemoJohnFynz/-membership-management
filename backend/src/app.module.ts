import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './avata/upload.module';
import { GoogleDriveModule } from 'nestjs-google-drive';
import { EvaluateModule } from './evaluate/evaluate.module';





@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    AuthModule,
    UploadModule,

    GoogleDriveModule.register({
      clientId: process.env.CLIENT_ID,
      clientSecret: 'secret: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',
      redirectUrl: 'https://developers.google.com/oauthplayground',
      refreshToken: '1//04Ps4KyJmssHbCgYIARAAGAQSNwF-L9IrMaIXYz_B2SkXXqTr-Ij-iKI6gAdYziop54zVfq9nN4khv0Ze2uOFuOm-sXkNpiLpkm0',
    }),

    EvaluateModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



// Nội dung thực hành ngày mai: Quản lý hội viên
// 1. Tạo chức năng cập nhật thông tin cho hội viên: đổi password, cập nhật avatar,....
// 2. Thêm 1 field role trong bảng user (hội viên role: 1, admin: role 0)
// 3. Thêm 1 hội viên mới sau đó set role=0 để đặt hội viên đó là admin
// (Lưu ý: Cần đăng ký cloud để upload image, phần này các bạn cần chuẩn bị trước ở nhà)