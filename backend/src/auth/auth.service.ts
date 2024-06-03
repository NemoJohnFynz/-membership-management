import { RegisterDto } from './dto/register.dto';
import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, Request, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update_user.dto';
import { ChangePasswordDto } from './dto/change_password.dto';
import { google } from 'googleapis';
import * as fs from 'fs';
import { UpdateAvatarDto } from './dto/upload_avata.dto';
import { InactiveAccountException } from './Exception/InActive';

    // private async genergateToKen(paylaod:(User{ name,address,role,gender,born}))
    // 1. Xây dựng trang đăng ký: tên đăng nhập, mật khẩu, họ tênfile: Express.Multer.File, GOOGLE_DRIVE_FOLDER_ID: stringê quán.

    // 2. Xây dựng chức năng đăng nhập cho user
    
    // 3. Sau khi đăng nhập sẽ chuyển đến trang hiển thị thông tin user


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
        

        
    ) {}
    async register(registerDto:RegisterDto): Promise<User>{
        const { name,  password,username,gender,born, address,role } = registerDto
        
        const checkuser = await this.userModel.findOne({ username });

        if(checkuser) {
            throw new HttpException('User name is alreadyy taken :(',HttpStatus.CONFLICT)
        }

        const hashPassword = await bcrypt.hash(password, 10)
        
        const user = await this.userModel.create({
            
            name,
            born,
            password: hashPassword,
            username,
            address,
            gender,
            role

        })
        
        return user;
    }

    
    


    async generateToken(user: User): Promise<{ access_token, refreshToken }> {
        // Trích xuất thông tin cần thiết từ đối tượng User

        
        const { 
            name, gender, address, born, role, username, avatar, completedEvaluations  } = user;
        
        // Tạo payload cho token, chứa các thông tin của người dùng
        const payload = { name, gender, address, born, role,username, avatar,completedEvaluations };
        
        
        // Tạo và trả về access token bằng cách sử dụng JwtService
        const access_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES')
        });
    
        // Tạo và trả về refresh token bằng cách sử dụng JwtService
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRETKEY_REFRESH'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_REFRESH')
        });
    
        // Lưu refresh token vào cơ sở dữ liệu
        await this.userModel.updateOne(
            { username: payload.username },
            { refreshtoken: refreshToken }
        );
    
        return { access_token, refreshToken };
    }



    async login(loginDto:LoginDto): Promise<{ access_token, refreshtoken }> {
        const { username,password } = loginDto
        const user = await this.userModel.findOne({ username })
        //kiểm tra trạng thái của tài khoản
        if (!user.isActive) {
            throw new InactiveAccountException;
        }
        //kiểm tra tài khoản có tồn tại 0 
        if (!user){
            throw new UnauthorizedException('Invalid user')
        }
        //kiểm tra mật khẩu có 9 sác 0 
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            throw new UnauthorizedException('Invalid username or password')
        }
        //gọi hàm generateToken truyền vào user(['thông tin user']) 
        const token = await this.generateToken(user)
        
        
        //trả về access token và refresh token 
         return { access_token:token.access_token,refreshtoken:token.refreshToken  };
    }

    async findUserByusername(username:string): Promise<any>{
        const user = await this.userModel.findOne({username: username})
        if(!user){
            throw new NotFoundException('user is not found in async finduserbyusername');

        }else return user;
    }

    async updateUser(username: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            // Tạo đối tượng cập nhật chỉ bao gồm các trường không phải null từ updateUserDto
            const updateData: Partial<UpdateUserDto> = {};
            for (const key in updateUserDto) {
                if (updateUserDto[key] !== null && updateUserDto[key] !== "" && updateUserDto[key] !== undefined) {
                    updateData[key] = updateUserDto[key];
                }
            }

            const user = await this.userModel.findOneAndUpdate(
                { username: username },
                updateData,
                { new: true }
            );
            if (!user) {
                throw new NotFoundException('User not found in async updateuser service');
            }
            return user;
        } catch (error) {
            throw new InternalServerErrorException('Failed to update user ');
        }
    }


    async changePassword(username: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        const user = await this.userModel.findOne({username:username});
    
        if (!user) {
          throw new NotFoundException('User not found in async change password service');
        }
    
        const { OldPassword, NewPassword } = changePasswordDto;
        const isPasswordMatch = await bcrypt.compare(OldPassword, user.password);
    
        if (!isPasswordMatch) {
          throw new BadRequestException('Old password is incorrect');
        }
    
        const hashedPassword = await bcrypt.hash(NewPassword, 10);
        user.password = hashedPassword;
        console.log('change password complete')
        await user.save();
        throw new HttpException('change password is successfully!', HttpStatus.OK);

      }
    

      async findAll():Promise<User[]>{
        const user = await this.userModel.find()
        return user
      }

      async updateIsMember(username: string, isMember: boolean): Promise<User> {
        const user = await this.findUserByusername(username);
        user.isMember = isMember;
        return user.save();
    }



    async toggleUserActive(username: string): Promise<User> {
        const user = await this.userModel.findOne({ username });
    
        if (!user) {
            throw new NotFoundException('User not found in async toggleUserActive service');
        }
    
        // Kiểm tra nếu vai trò của người dùng là admin (role = 0), không cho phép thay đổi trạng thái
        if (user.role === 0) {
            throw new ForbiddenException('Cannot deactivate admin user');
        }
    
        user.isActive = !user.isActive; // Chuyển đổi trạng thái
        await user.save(); // Lưu thay đổi
        return user;
    }

    async updateUserAvatar(username: string, avatarUrl: string): Promise<User> {
        const user = await this.userModel.findOneAndUpdate(
            { username: username },
            { avatar: avatarUrl },
            { new:true, projection: {username:1, avatar:1}}
        );
            if(!user){
                throw new NotFoundException('user is not exit please try again')
            }
            return user;      
    }

}




    // async updateAvatar(username: string, file: Express.Multer.File) {
    //     const GOOGLE_DRIVE_FOLDER_ID = process.env.googleDriveFolderId;
        
    //     const avatarUrl = await this.googleDriveService.uploadImage(
    //       file,
    //       GOOGLE_DRIVE_FOLDER_ID,
    //     );
    //     const user = await this.userModel.findOneAndUpdate(
    //         { username },
    //         { avatar:avatarUrl },
    //         { new: true, projection: { username: 1, avatar: 1 } }
    //     );
    
    //     return { avatarUrl, user };
    //   }

    //cập nhật avata của user(dùng google drive)
    // async uploadAvatarToDrive(avatarFile: Express.Multer.File): Promise<string> {
    //     const auth = new google.auth.GoogleAuth({
    //       // Add your client ID, client secret, and redirect URI here
    //     });
    
    //     const drive = google.drive({ version: 'v3', auth });
    
    //     const fileMetadata = {
    //       name: avatarFile.originalname,
    //     };
    
    //     const media = {
    //       mimeType: avatarFile.mimetype,
    //       body: fs.createReadStream(avatarFile.path),
    //     };
    
    //     const uploadedFile = drive.files.create({
    //         resource: fileMetadata,
    //         media: media,
    //         fields: 'id',
    //     });
    
    //     return `https://drive.google.com/uc?id=${uploadedFile.data.id}`;
    //   }

    // async uploadAvatarToDrive(avatarFile: Express.Multer.File): Promise<string> {
    //     if (!avatarFile || !avatarFile.path) {
    //       throw new Error('Avatar file is missing or has invalid path');
    //     }
      
    //     const auth = new google.auth.GoogleAuth({
    //       // Add your client ID, client secret, and redirect URI here
    //     });
      
    //     const drive = google.drive({ version: 'v3', auth });
      
    //     const fileMetadata = {
    //       name: avatarFile.originalname,
    //     };
      
    //     const media = {
    //       mimeType: avatarFile.mimetype,
    //       body: fs.createReadStream(avatarFile.path),
    //     };
      
    //     const uploadedFile = await drive.files.create({
    //       requestBody: fileMetadata,
    //       media: media,
    //       fields: 'id',
    //     });
      
    //     return `https://drive.google.com/uc?id=${uploadedFile.data.id}`;
    //   }
    // async updateAvatar(username: string, updateAvatarDto: UpdateAvatarDto): Promise<string> {
    //     const { avata } = updateAvatarDto;
    //     const user = await this.userModel.findOne({ username });
    //     if (!user) {
    //       throw new Error('User not found, ');
    //     }
    //     user.avata = avata;
    //     await user.save();
    //     return avata;
    //   }

   
    

    // async uploadAvatarToDrive(avatarFile: Express.Multer.File): Promise<string> {
    //     try {
    //       if (!avatarFile || !avatarFile.path) {
    //         throw new Error('Avatar file is missing or has invalid path');
    //       }
    
    //       const auth = new google.auth.OAuth2(
    //         process.env.CLIENT_ID,
    //         process.env.CLIENT_SECRET,
    //         process.env.REDIRECT_URI
    //       );
    
    //       const drive = google.drive({ version: 'v3', auth });
    
    //       const fileMetadata = {
    //         name: avatarFile.originalname,
    //         parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Thiết lập ID thư mục Google Drive nếu cần
    //       };
    
    //       const media = {
    //         mimeType: avatarFile.mimetype,
    //         body: fs.createReadStream(avatarFile.path),
    //       };
    
    //       const uploadedFile = await drive.files.create({
    //         requestBody: fileMetadata,
    //         media: media,
    //         fields: 'id',
    //       });
    
    //       // Xóa tệp tin avatar sau khi đã upload lên Google Drive
    //       fs.unlinkSync(avatarFile.path);
    
    //       return `https://drive.google.com/uc?id=${uploadedFile.data.id}`;
    //     } catch (error) {
    //       throw new Error(`Failed to upload avatar to Google Drive: ${error.message}`);
    //     }
    //   }

    // async updateAvatar(username: string, updateAvatarDto: UpdateAvatarDto): Promise<string> {
    // try {
    //     const { avatar } = updateAvatarDto;
    //     const user = await this.userModel.findOne({ username });
    //     if (!user) {
    //     throw new Error('User not found');
    //     }
    //     user.avatar = avatar;
    //     await user.save();
    //     return avatar;
    // } catch (error) {
    //     throw new Error(`Failed to update avatar: ${error.message}`);
    // }
    // }




//     async updateAvatar(username: string, avatarUrl: string): Promise<string> {
    //     const user = await this.userModel.findOne({ username });
    //     if (!user) {
    //       throw new Error('User not found');
    //     }
    //     user.avata = avatarUrl;
    //     await user.save();
    //     return avatarUrl;
    //   }
    
    //   async getUserIdFromToken(token: string): Promise<string | null> {
    //     try {
    //       // Giải mã token
    //       // Lấy _id từ payload
    //       const userId = decodedToken.sub;
    
    //       // Kiểm tra xem user có tồn tại trong cơ sở dữ liệu không
    //       const user = await this.userModel.findById(userId);
    
    //       if (!user) {
    //         return null; // Nếu user không tồn tại, trả về null
    //       }
    
    //       return userId;
    //     } catch (error) {
    //       console.error('Error decoding token:', error);
    //       return null;
    //     }
      

    // async updateuser(id:string,updateUserDto:UpdateUserDto): Promise<User>{
    //     return await this.userModel.findByIdAndUpdate(id, User,{
    //         new: true,
    //         runValidators: true,
    //     })
    // }






// private async generateToken(user:User): Promise<string> {
    //     const { _id, name, gender, numberphone } = user;
    //     const paylaod = {_id}
    //     const access_token = await this.jwtService.sign( {  } );
    //     return access_token;
    // }

//     async signUp(signUpDto): Promise<{ token: string }>{
//         const { name, email, password,username,numberphone,gender } = signUpDto

//         const hashPassword = await bcrypt.hash(password, 10)

//         const user = await this.userModel.create({
//             name,
//             email,
//             password: hashPassword,
//             username,
//             numberphone,
//             gender

//         })

//         const token = this.jwtService.sign({ id: user._id})
//         return { token };
//     }

//     async login( loginDto: LoginDto ):Promise  <{ token: string }>  {
//         const { email, password } = loginDto;

//         const user = await this.userModel.findOne({ email })

//         if(!user) {
//             throw new UnauthorizedException('Invalid email or password')
//         }

//         const isPasswordCorrect = await bcrypt.compare(password, user.password)

//         if(!isPasswordCorrect) {
//             throw new UnauthorizedException('Invalid email or password')
//         }

//         const token = this.jwtService.sign({ id: user._id});
//         return { token };
        
//     }
        // async generateToken(user: User): Promise<{ access_token, refreshToken }> {
    //     // Trích xuất thông tin cần thiết từ đối tượng User

    //     const {  name, gender,address, born, role } = user;

    //     // Tạo payload cho token, chứa các thông tin của người dùng
    //     const payload = { name, gender, address, born, role  };
        

    //         //   Secret key and expiration for access token
    //     const accessSecretKey = this.configService.get<string>('JWT_SECRET');
    //     const accessTokenExpiresIn = this.configService.get<string>('JWT_EXPIRES');
    //     // Tạo và trả về token bằng cách sử dụng JwtService
    //     const refreshSecretKey = this.configService.get<string>('SECRETKEY_REFRESH');
    //     const refreshTokenExpiresIn = this.configService.get<string>('JWT_EXPIRES_REFRESH');
    //     const access_token = await this.jwtService.signAsync(payload);

     
    //     const refreshToken = await this.jwtService.sign(payload);
    //     // Secret key and expiration for refresh token
    

    //     await this.userModel.updateOne(
    //         {user:user.username},
    //         {refreshtoken:refreshToken},
    //     )
        
    //     return {access_token, refreshToken};
    // }

    // async generateRefreshToken(user: User): Promise<{ refreshToken }> {
    //     // Generate a refresh token here (you can use a similar approach as generateToken)
    //     // For simplicity, let's assume it's generated in a similar manner as the access token
    //     const refreshToken = await this.jwtService.sign({ user: user.username });
    //     // Store the refresh token in the user document or any other secure location
    //     user.refreshtoken = refreshToken;
    //     await this.userModel.findOneAndUpdate({user: user.username},{ refreshToken: refreshToken }),
    //     return { refreshToken } ;
    //   }

    //   async generateRefreshToken(user: User): Promise<{ refreshToken }> {
    //     const refreshToken = await this.jwtService.signAsync({ user: user.username });
    //     user.refreshtoken = refreshToken;
    //     await this.userModel.findOneAndUpdate({ user: user.username }, { refreshToken: refreshToken });
    //     return { refreshToken };
    // }
        
// }
