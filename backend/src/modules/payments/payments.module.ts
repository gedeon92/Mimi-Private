import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { ManualPaymentProvider } from "./providers/manual.provider";

@Module({
  providers: [PaymentsService, ManualPaymentProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}
