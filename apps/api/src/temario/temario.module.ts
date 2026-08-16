import { Module } from "@nestjs/common";
import { TemarioController } from "./temario.controller";
import { TemarioService } from "./temario.service";

@Module({
  controllers: [TemarioController],
  providers: [TemarioService],
})
export class TemarioModule {}
