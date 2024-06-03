import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAvatarDto {

  @IsNotEmpty()
  @IsString()
  avatar: string; // Avatar field is a string representing the Google Drive URL
}