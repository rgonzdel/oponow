import { Type } from "class-transformer";
import { IsIn, IsOptional } from "class-validator";

export class ResumenQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsIn([7, 14, 30])
  dias?: 7 | 14 | 30;
}
