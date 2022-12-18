/**
 * @description SRP를 위반하는 구조이지만 테스트용으로 한 파일에 두 클래스를 선언했다.
 *
 * SRP란: 한 클래스는 하나의 책임만 가져야한다. (단일 책임의 원칙)
 */
export class CreateUserDto {
  user_id: string; //유저 고유 아이디

  // 최소 8자 및 최대 16자, 하나 이상의 대문자, 하나의 소문자, 하나의 숫자 및 하나의 특수 문자
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
  //   {
  //     message: '비밀번호 양식에 맞게 작성하세요.',
  //   },
  // )
  password: string; //유저 비밀번호

  name: string; //유저 이름
  age: number; //유저나이
}

export class UpdateUserDto extends CreateUserDto {
  id: number;
}
