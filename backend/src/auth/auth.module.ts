import { Module, Global } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { diskStorage } from 'multer';
import * as path from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { Request } from 'express';

interface CustomRequest extends Request {
  params: {
    username: string;
  };
}

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Thư mục lưu trữ file
        filename: (req: CustomRequest, file, cb) => {
          const username = req.params.username;
          const filename = `${username}_${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, AuthService, MongooseModule],
})
export class AuthModule {}




// import { Module, Global } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UserSchema } from './schema/user.schema';
// import { JwtStrategy } from './jwt.strategy';
// import { diskStorage } from 'multer';
// import * as path from 'path';
// import { MulterModule } from '@nestjs/platform-express';
// import { Request } from 'express';


// @Global()
// @Module({
//   imports:[

//     MulterModule.register({
//       storage: diskStorage({
//         destination: './uploads', // Thư mục lưu trữ file
//         filename: (req: Request, file, cb) => {
//           const username = req.params.username;
//           const filename = `${username}_${file.originalname}`;
//           cb(null, filename);
//         },
//       }),
//     }),
  
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.registerAsync({
//       imports:[ConfigModule],
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => {
//         return{
//           secret: config.get<string>('JWT_SECRET'),
//           signOptions: {
//             expiresIn: config.get< string | number >('JWT_EXPIRES'),
//           },
//         };
//       },
//     }),
    
//     MongooseModule.forFeature([{ name: 'User', schema : UserSchema }]),
//   ],

//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy],
//   exports: [JwtStrategy, PassportModule,AuthService,MongooseModule,],
// })
// export class AuthModule {}
