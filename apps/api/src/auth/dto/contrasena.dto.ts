import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

// Token del enlace del correo: 32 bytes en base64url (token.util.ts).
const TOKEN = /^[A-Za-z0-9_-]{43}$/;

export class OlvidadaDto {
  @IsEmail()
  @MaxLength(255)
  email!: string;
}

export class ComprobarEnlaceDto {
  @Matches(TOKEN, { message: "Enlace no válido" })
  token!: string;
}

export class RestablecerDto {
  @Matches(TOKEN, { message: "Enlace no válido" })
  token!: string;

  @IsString()
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  @MaxLength(72)
  password!: string;
}
