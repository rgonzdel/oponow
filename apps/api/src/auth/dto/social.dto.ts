import { IsString, MaxLength, MinLength } from "class-validator";

export class GoogleLoginDto {
  /** ID token (JWT) que entrega "Sign in with Google" en el navegador. */
  @IsString()
  @MinLength(20)
  @MaxLength(4096)
  credential!: string;
}

export class FacebookLoginDto {
  @IsString()
  @MinLength(20)
  @MaxLength(1024)
  accessToken!: string;
}
