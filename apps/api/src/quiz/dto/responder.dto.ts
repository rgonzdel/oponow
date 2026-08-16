import { IsInt, IsUUID, Min } from "class-validator";

export class ResponderDto {
  @IsUUID()
  preguntaId!: string;

  @IsInt()
  @Min(0)
  opcionElegida!: number;
}
