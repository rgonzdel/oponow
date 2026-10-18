import { IsIn } from "class-validator";

export class UpdatePlanDto {
  @IsIn(["free", "lite", "vip", "prueba"])
  plan!: "free" | "lite" | "vip" | "prueba";
}
