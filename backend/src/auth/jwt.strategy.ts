import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy, ExtractJwt} from "passport-jwt";
import { User } from "./schema/user.schema";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>, 
        private jwtService:JwtService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpriration:false,
            secretOrKey: process.env.JWT_SECRET
        })
    }


    async validate(payload) {
        const { sub } = payload; // Trích xuất username từ thuộc tính sub trong payload
        console.log(sub);
        const user = await this.userModel.findOne({ username: sub }); // Tìm kiếm user bằng username
        
        if (!user) {
            throw new UnauthorizedException('Account does not exist!!!');
        }
        
        return user;
    }

    // async validate(paylaod) {
    //     const { sub } = paylaod;
    //     console.log(sub)
    //     const user = await this.userModel.findById(sub)

    //     if(!user){
    //         throw new UnauthorizedException('account is not exit!!!')
    //     }
    //     return user;
    // }

    // async DecodeToken(token:string): Promise<User>{
    //     const DecodeToken = await this.jwtService.verifyAsync(token)
    //     const userName = DecodeToken.username
    //     console.log(userName)
    //     return userName;
    // }
}