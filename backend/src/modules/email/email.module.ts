import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { BrevoClient } from "./brevo.client";

@Module({
  providers: [EmailService, BrevoClient],
  exports: [EmailService],
})
export class EmailModule {}
