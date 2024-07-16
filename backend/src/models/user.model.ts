import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from "class-validator";

export class UserCreate {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @Length(2, 50)
  name!: string;

  @IsString()
  @Matches(/^[0-9]{9,11}$/, {
    message: "Phone number must be 9 or 11 digits",
  })
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 20)
  password!: string;
}

export class UserUpdate {
  @IsUUID()
  id!: string;

  @IsString()
  @Length(2, 50)
  name!: string;

  @IsString()
  @Matches(/^[0-9]{9,11}$/, {
    message: "Phone number must be 9 or 11 digits",
  })
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 20)
  password!: string;
}
