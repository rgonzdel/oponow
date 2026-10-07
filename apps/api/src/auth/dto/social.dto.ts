import { IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

export class GoogleLoginDto {
  /** ID token (JWT) del botón de Google Identity Services. */
  @ValidateIf((o: GoogleLoginDto) => !o.code)
  @IsString()
  @MinLength(20)
  @MaxLength(4096)
  credential?: string;

  /** Código de autorización del botón propio (flujo de código en popup). */
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2048)
  code?: string;
}

export class FacebookLoginDto {
  @IsString()
  @MinLength(20)
  @MaxLength(1024)
  accessToken!: string;
}
