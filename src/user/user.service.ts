import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  //service에서 생성자로 repository를 받아온다.
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findALl(): Promise<User[]> {
    return this.userRepository.find();
  }
  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  // 전체 요소 모두 가져오기
  findAll() {
    return this.userRepository.find();
  }

  // 요소 1개만 가지고 오기
  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  // 쿼리로 가져오기
  findByQuery(user_id: string) {
    return this.userRepository.find({ where: { user_id } });
  }

  // update의 2가지 방법

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   // const user = await this.findOne(id);
  //   // return this.userRepository.save({ ...user, ...updateUserDto });
  // }
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  // delete의 2가지 방법

  // async remove(id: number) {
  //   const user = await this.findOne(id);
  //   return this.userRepository.remove(user);
  // }
  remove(id: number) {
    return this.userRepository.delete(id);
  }
}