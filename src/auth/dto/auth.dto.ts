export class UserSignUpDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  age: string;
}

export class UserSignInDto {
  email: string;
  password: string;
}
