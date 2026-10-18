import { Transform } from "class-transformer";
import { ArrayMaxSize, IsArray, IsDateString, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

/** Cuenta de prueba y testeo: entra con usuario y contraseña, sin email ni pago. */
export class CrearCuentaPruebaDto {
  /** 3-30 caracteres: letras, números, punto, guion y guion bajo. Se guarda en minúsculas. */
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  @IsString()
  @Matches(/^[a-z0-9._-]{3,30}$/, {
    message: "El usuario debe tener entre 3 y 30 caracteres: letras, números, punto, guion o guion bajo (sin espacios ni @)",
  })
  usuario!: string;

  @IsString()
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  @MaxLength(72)
  password!: string;

  /** Oposiciones a las que tendrá acceso completo. */
  @IsArray()
  @ArrayMaxSize(50)
  @IsUUID("all", { each: true })
  oposicionIds!: string[];

  /** Fecha y hora (ISO) a partir de la cual la cuenta deja de poder entrar. */
  @IsDateString({}, { message: "Fecha de caducidad no válida" })
  accesoExpira!: string;
}

export class UpdateAccesoDto {
  @IsDateString({}, { message: "Fecha de caducidad no válida" })
  accesoExpira!: string;
}
