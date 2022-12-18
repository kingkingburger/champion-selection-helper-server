import { Inject } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../config/typeorm.config';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';

// Import the module and the controller you want to test
describe('MyController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   imports: [
    //     TypeOrmModule.forRoot(TypeOrmConfig), // TypeORM 설정파일 연결
    //     UserModule,
    //   ],
    //   controllers: [UserController],
    //   providers: [UserService],
    // }).compile();

    // controller = module.get<UserController>(UserController);
    controller = new UserController(userService);
  });

  it('컨트롤러에서 유저 1개 가지고오기 테스트', () => {
    // Use the controller's methods to get the expected output
    // Use Jest's `expect` function to assert that the
    // output is as expected
  });
});
