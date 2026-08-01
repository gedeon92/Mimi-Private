import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import type { Env } from "./config/env.validation";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<Env, true>);

  const allowedOrigins = config
    .get("CORS_ORIGIN", { infer: true })
    .split(",")
    .map((origin) => origin.trim());

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = config.get("PORT", { infer: true });
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API démarrée sur http://localhost:${port}/api`);
}

bootstrap();
