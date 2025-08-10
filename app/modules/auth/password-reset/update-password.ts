export class UpdatePasswordDto {
  declare token: number;

  declare email: string;

  declare password: string;

  declare confirm_password: string;
}
