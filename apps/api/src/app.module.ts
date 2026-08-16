import path from "node:path";
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { DatabaseModule } from "./database/database.module";
import { RlsContextMiddleware } from "./database/rls-context.middleware";
import { AuthModule } from "./auth/auth.module";
import { BillingModule } from "./billing/billing.module";
import { TemarioModule } from "./temario/temario.module";
import { QuizModule } from "./quiz/quiz.module";
import { AgendaModule } from "./agenda/agenda.module";

@Module({
  imports: [
    // apps/api se ejecuta con cwd = apps/api (pnpm --filter), pero el .env
    // vive en la raíz del monorepo (junto a docker-compose.yml).
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, "../../../.env"),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_ACCESS_SECRET"),
        signOptions: {
          expiresIn: config.get<string>("JWT_ACCESS_EXPIRES_IN", "15m"),
        },
      }),
    }),
    ThrottlerModule.forRoot([
      // Default global: 60 peticiones/min por IP. Rutas concretas (login,
      // register) aplican límites más estrictos con su propio @Throttle().
      { name: "default", ttl: 60_000, limit: 60 },
    ]),
    DatabaseModule,
    AuthModule,
    BillingModule,
    TemarioModule,
    QuizModule,
    AgendaModule,
  ],
  providers: [
    RlsContextMiddleware,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RlsContextMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
