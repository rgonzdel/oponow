import "reflect-metadata";
import cookieParser from "cookie-parser";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());
  // credentials: true + origin explícito (no '*') son obligatorios para que
  // el navegador acepte/envíe la cookie httpOnly de refresh.
  app.enableCors({
    origin: config.get<string>("WEB_ORIGIN", "http://localhost:5173"),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Render (y la mayoría de PaaS) inyectan el puerto a usar en `PORT`, no en
  // una variable propia — hay que respetarla si existe. En local no la
  // define nadie, así que cae a API_PORT/3000 como hasta ahora.
  const port = config.get<number>("PORT") ?? config.get<number>("API_PORT", 3000);
  await app.listen(port);
  console.log(`Oponow API escuchando en el puerto ${port}`);
}

bootstrap();
