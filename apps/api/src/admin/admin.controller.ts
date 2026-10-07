import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { ListUsuariosQueryDto } from "./dto/list-usuarios-query.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { UpdateRolDto } from "./dto/update-rol.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermisoGuard, RequierePermiso } from "../auth/guards/permiso.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

// Cada ruta exige un permiso concreto según el rol (ver auth/roles.ts).
@Controller("admin")
@UseGuards(JwtAuthGuard, PermisoGuard)
@RequierePermiso("panel")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("resumen")
  @RequierePermiso("ver_estadisticas")
  resumen() {
    return this.adminService.resumen();
  }

  @Get("roles")
  roles(@CurrentUser() user: AuthenticatedUser) {
    return this.adminService.roles(user.permisos.includes("ver_usuarios"));
  }

  @Get("contenido")
  @RequierePermiso("ver_contenido")
  contenido() {
    return this.adminService.contenido();
  }

  @Get("usuarios")
  @RequierePermiso("ver_usuarios")
  listUsuarios(@Query() query: ListUsuariosQueryDto) {
    return this.adminService.listUsuarios(query);
  }

  @Get("usuarios/:id")
  @RequierePermiso("ver_usuarios")
  getUsuario(@CurrentUser() user: AuthenticatedUser, @Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.getUsuario(id, user.permisos.includes("ver_suscripciones"));
  }

  @Patch("usuarios/:id/plan")
  @RequierePermiso("cambiar_plan")
  updatePlan(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdatePlanDto) {
    return this.adminService.updatePlan(id, dto);
  }

  @Patch("usuarios/:id/rol")
  @RequierePermiso("asignar_roles")
  updateRol(@CurrentUser() user: AuthenticatedUser, @Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateRolDto) {
    return this.adminService.updateRol(user.id, id, dto.rol);
  }
}
