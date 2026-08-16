import { IsIn } from "class-validator";

export class UpdatePlanDto {
  @IsIn(["free", "lite", "vip"])
  plan!: "free" | "lite" | "vip";
}
