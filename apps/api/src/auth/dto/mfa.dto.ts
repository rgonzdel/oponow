import { IsUUID, Matches } from "class-validator";

export class MfaReenviarDto {
  @IsUUID()
  desafioId!: string;
}

export class MfaVerificarDto {
  @IsUUID()
  desafioId!: string;

  @Matches(/^\d{6}$/, { message: "El código son 6 dígitos" })
  codigo!: string;
}
