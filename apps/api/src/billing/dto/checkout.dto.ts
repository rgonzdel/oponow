import { IsBoolean, IsIn, IsOptional, IsString, Length, Matches } from "class-validator";

export class CheckoutDto {
  @IsString()
  @Length(1, 100)
  oposicionSlug!: string;

  @IsOptional()
  @IsIn(["mensual", "anual"])
  ciclo?: "mensual" | "anual";

  /** true: formulario de Stripe dentro de Oponow (ventana integrada). */
  @IsOptional()
  @IsBoolean()
  integrado?: boolean;
}

export class ConfirmarCheckoutDto {
  @Matches(/^cs_(test|live)_[A-Za-z0-9]+$/, { message: "Sesión de pago no válida" })
  sessionId!: string;
}
