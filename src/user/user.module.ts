import { UserRepository } from './../user/repository/user.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //UserRepository 등록
  controllers: [UserController],
  providers: [UserService, UserRepository], //프로바이더 등록
})
export class UserModule {
  // implements NestModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     // exclude 함수는 제외하고 싶은 라우터를 등록합니다.
  //     .exclude({ path: 'user/create_user', method: RequestMethod.POST }) // 유저 생성
  //     .exclude({ path: 'user/user_all', method: RequestMethod.GET }) // 유저조회
  //     .forRoutes(UserController); //1. 유저 컨트롤러 등록
  //   //forRoutes('user') // 2. 유저 컨트롤러 경로 등록 -> 위 1번과 동일
  // }
}
