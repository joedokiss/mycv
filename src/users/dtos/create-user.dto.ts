import { IsEmail, IsString } from 'class-validator';

export class CreateuserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
