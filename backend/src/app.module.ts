import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { validateEnv } from "./config/env.validation";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ProductsModule } from "./modules/products/products.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AddressesModule } from "./modules/addresses/addresses.module";
import { CartModule } from "./modules/cart/cart.module";
import { FavoritesModule } from "./modules/favorites/favorites.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { UsersModule } from "./modules/users/users.module";
import { AdminModule } from "./modules/admin/admin.module";
import { EmailModule } from "./modules/email/email.module";
import { PaymentsModule } from "./modules/payments/payments.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    EmailModule,
    PaymentsModule,
    AuthModule,
    AddressesModule,
    CartModule,
    FavoritesModule,
    OrdersModule,
    UsersModule,
    AdminModule,
    CategoriesModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
