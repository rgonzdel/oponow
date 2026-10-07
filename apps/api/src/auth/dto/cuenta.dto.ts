import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CambiarContrasenaDto {
  @IsString()
  @MaxLength(72)
  actual!: string;

  @IsString()
  @MinLength(8, { message: "La contraseña nueva debe tener al menos 8 caracteres" })
  @MaxLength(72)
  nueva!: string;
}

export class CambiarEmailDto {
  @IsEmail({}, { message: "Email no válido" })
  @MaxLength(255)
  email!: string;

  @IsString()
  @MaxLength(72)
  password!: string;
}

export class ConfirmarEmailDto {
  @IsString()
  @MaxLength(2000)
  token!: string;
}

export class BorrarCuentaDto {
  /** Obligatoria si la cuenta tiene contraseña (se comprueba en el servicio). */
  @IsOptional()
  @IsString()
  @MaxLength(72)
  password?: string;
}
