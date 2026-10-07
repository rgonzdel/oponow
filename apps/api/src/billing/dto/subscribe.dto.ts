import { IsIn, IsOptional, IsString, Length, Matches } from "class-validator";

export class SubscribeDto {
  @IsString()
  oposicionSlug!: string;

  @IsOptional()
  @IsIn(["mensual", "anual"])
  ciclo?: "mensual" | "anual";

  @IsString()
  @Length(13, 23) // hasta 19 dígitos + espacios de formato
  cardNumber!: string;

  @Matches(/^\d{2}\/\d{2}$/, { message: "Formato de caducidad: MM/AA" })
  cardExpiry!: string;

  @IsString()
  @Length(3, 4)
  cardCvc!: string;

  @IsString()
  @Length(1, 120)
  cardName!: string;
}
