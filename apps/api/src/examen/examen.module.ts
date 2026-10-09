import { Module } from "@nestjs/common";
import { ExamenController } from "./examen.controller";
import { ExamenService } from "./examen.service";

@Module({
  controllers: [ExamenController],
  providers: [ExamenService],
})
export class ExamenModule {}
