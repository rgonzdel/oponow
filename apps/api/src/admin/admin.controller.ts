import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { ListUsuariosQueryDto } from "./dto/list-usuarios-query.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";

@Controller("admin")
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("usuarios")
  listUsuarios(@Query() query: ListUsuariosQueryDto) {
    return this.adminService.listUsuarios(query);
  }

  @Get("usuarios/:id")
  getUsuario(@Param("id") id: string) {
    return this.adminService.getUsuario(id);
  }

  @Patch("usuarios/:id/plan")
  updatePlan(@Param("id") id: string, @Body() dto: UpdatePlanDto) {
    return this.adminService.updatePlan(id, dto);
  }
}
