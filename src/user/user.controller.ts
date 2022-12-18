import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';

import { UserService } from './user.service';

@Controller('/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create_user')
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.create(createUserDto);
  }

  // @Get('/user_all')
  // getUserAll(): Promise<User[]> {
  //   return this.userService.findAll();
  // }

  @Get('/user/:id')
  findByUserOne2(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }
  // @Get('/userinfo')
  // findByUser(@Query('user') user: string): Promise<User[]> {
  //   return this.userService.findByQuery(user);
  // }

  // @Post('/user/:id')
  // setUser(
  //   @Param('id') id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<UpdateResult> {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Delete('/user/delete')
  // deleteUser(@Query('id') id: number): Promise<DeleteResult> {
  //   return this.userService.remove(id);
  // }
}
