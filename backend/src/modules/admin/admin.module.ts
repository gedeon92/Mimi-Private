import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard/dashboard.controller";
import { DashboardService } from "./dashboard/dashboard.service";
import { ProductsAdminController } from "./products/products-admin.controller";
import { ProductsAdminService } from "./products/products-admin.service";
import { CategoriesAdminController } from "./categories/categories-admin.controller";
import { CategoriesAdminService } from "./categories/categories-admin.service";
import { OrdersAdminController } from "./orders/orders-admin.controller";
import { OrdersAdminService } from "./orders/orders-admin.service";
import { CustomersAdminController } from "./customers/customers-admin.controller";
import { CustomersAdminService } from "./customers/customers-admin.service";
import { UploadsController } from "./uploads/uploads.controller";
import { CloudinaryService } from "./uploads/cloudinary.service";

@Module({
  controllers: [
    DashboardController,
    ProductsAdminController,
    CategoriesAdminController,
    OrdersAdminController,
    CustomersAdminController,
    UploadsController,
  ],
  providers: [
    DashboardService,
    ProductsAdminService,
    CategoriesAdminService,
    OrdersAdminService,
    CustomersAdminService,
    CloudinaryService,
  ],
})
export class AdminModule {}
