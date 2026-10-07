import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { ROLES, type Rol } from "../../auth/roles";

export class ListUsuariosQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  /** Solo usuarios con este rol (p. ej. el equipo de soporte). */
  @IsOptional()
  @IsIn(ROLES)
  rol?: Rol;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
