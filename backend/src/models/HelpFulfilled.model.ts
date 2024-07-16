import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";

export class HelpFulfilledCreate {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  helpId!: string;

  @IsUUID()
  donorId!: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;
}

export class HelpFulfilledUpdate {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsUUID()
  helpId!: string;

  @IsUUID()
  donorId!: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;
}
