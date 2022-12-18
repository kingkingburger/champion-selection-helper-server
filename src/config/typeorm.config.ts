import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mariadb', //Database 설정
  host: 'localhost',
  port: 3308,
  username: 'root',
  password: '1234',
  database: 'dev',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // autoLoadEntities: true, //	autoLoadEntities 옵션을 사용 안하면 entities: [] 옵션에 사용할 모든 엔티티를 넣어줘야함.”*/entities/.entity.ts” 같은 패턴형식도 가능
  synchronize: true, //true 값을 설정하면 어플리케이션을 다시 실행할 때 엔티티안에서 수정된 컬럼의 길이 타입 변경값등을 해당 테이블을 Drop한 후 다시 생성해준다. jpa에서 create, update 로 바꾸는거 같습니다.
};
