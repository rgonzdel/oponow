import { IsOptional, IsString, MinLength } from "class-validator";

export class RefreshDto {
  // Opcional a nivel de DTO: el cliente web lo manda vía cookie httpOnly, no
  // en el body. El controller exige que venga de al menos una de las dos
  // fuentes (ver resolveRefreshToken en auth.controller.ts).
  @IsOptional()
  @IsString()
  @MinLength(1)
  refreshToken?: string;
}
