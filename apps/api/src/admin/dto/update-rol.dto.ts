import { IsIn } from "class-validator";
import { ROLES, type Rol } from "../../auth/roles";

export class UpdateRolDto {
  @IsIn(ROLES, { message: "Rol no válido" })
  rol!: Rol;
}
