import { IsBoolean, IsISO8601, IsOptional, IsString, Length } from "class-validator";

export class UpdateTareaDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  titulo?: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  descripcion?: string;

  @IsOptional()
  @IsISO8601()
  fecha?: string;

  @IsOptional()
  @IsBoolean()
  completada?: boolean;
}
