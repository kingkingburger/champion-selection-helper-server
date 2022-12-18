import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/user.dto';

import { User } from '../entity/user.entity';

// user.repository.ts
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // getById(id: number) {
  //   return this.userRepository.findOneBy({ id });
  //   // return this.userRepository.find({ where: { id } });
  // }
  // create(createuser:CreateUserDto){
  //   this.userRepository.save(createuser);
  // }
}
/*
// user.service.ts
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: string): Promise<User> {
    return this.userRepository.getById(id);
  }
  // ...
}
*/

/*
// user.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])],
    // ...
  ],
  providers: [UserService, UserRepository],
  // ...
})
export class UserModule {}
*/
