import { Body, Controller, Post } from '@nestjs/common';
import { CreateuserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  @Post('/signup')
  createUser(@Body() body: CreateuserDto) {
    console.log(body);
  }
}
