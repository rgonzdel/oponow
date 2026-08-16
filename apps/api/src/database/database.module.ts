import { Global, Inject, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createRuntimeSql, type Sql } from "@oponow/db";

export const APP_DATABASE_POOL = Symbol("APP_DATABASE_POOL");
export const AUTH_DATABASE_POOL = Symbol("AUTH_DATABASE_POOL");

@Global()
@Module({
  providers: [
    {
      provide: APP_DATABASE_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Sql =>
        createRuntimeSql(config.getOrThrow<string>("DATABASE_APP_URL")),
    },
    {
      provide: AUTH_DATABASE_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Sql =>
        createRuntimeSql(config.getOrThrow<string>("DATABASE_AUTH_URL")),
    },
  ],
  exports: [APP_DATABASE_POOL, AUTH_DATABASE_POOL],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(
    @Inject(APP_DATABASE_POOL) private readonly appPool: Sql,
    @Inject(AUTH_DATABASE_POOL) private readonly authPool: Sql,
  ) {}

  async onApplicationShutdown() {
    await Promise.all([
      this.appPool.end({ timeout: 5 }),
      this.authPool.end({ timeout: 5 }),
    ]);
  }
}
