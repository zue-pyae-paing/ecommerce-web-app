export enum Role {
  ADMIN = "Admin",
  USER = "User",
}
export interface RegisterUserDto {
  userName: string;
  email: string;
  password: string;
  confrimPassword: string;
  role: Role;
}

export interface LoginUserDto {
  email:string
  password:string
}

export interface ResetPassword {
  token:string
  newPassword:string
}
