import { IsISO8601 } from "class-validator";

export class ListGoogleEventosQueryDto {
  @IsISO8601()
  desde!: string;

  @IsISO8601()
  hasta!: string;
}
