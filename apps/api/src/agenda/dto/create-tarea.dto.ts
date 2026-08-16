import { IsISO8601, IsOptional, IsString, Length } from "class-validator";

export class CreateTareaDto {
  @IsString()
  @Length(1, 200)
  titulo!: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  descripcion?: string;

  @IsISO8601()
  fecha!: string;
}
