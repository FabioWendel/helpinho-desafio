import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class HelpCreate {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  goal?: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsUUID()
  requesterId!: string;
}

export class HelpUpdate {
  @IsUUID()
  id!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsOptional()
  goal?: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsUUID()
  requesterId!: string;
}
