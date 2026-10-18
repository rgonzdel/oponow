import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  /** Email, o el nombre de usuario de una cuenta de prueba (sin "@"). */
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password!: string;

  /** Solo app móvil: token de dispositivo de confianza guardado tras el MFA
   * (la web lo manda en cookie). */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  dispositivo?: string;
}
