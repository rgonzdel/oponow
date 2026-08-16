import { IsIn, IsISO8601, IsOptional } from "class-validator";

export type FallosGroupBy = "day" | "month" | "year";

export class FallosQueryDto {
  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;

  @IsOptional()
  @IsIn(["day", "month", "year"])
  groupBy?: FallosGroupBy;
}
