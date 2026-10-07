import { Module } from "@nestjs/common";
import { InformeController } from "./informe.controller";
import { InformeService } from "./informe.service";

@Module({
  controllers: [InformeController],
  providers: [InformeService],
})
export class InformeModule {}
