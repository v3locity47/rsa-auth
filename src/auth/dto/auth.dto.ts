export class UserSignUpDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  age: number;
}

export class UserSignInDto {
  email: string;
  password: string;
}
