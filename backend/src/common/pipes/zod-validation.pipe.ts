import { BadRequestException, PipeTransform } from "@nestjs/common";
import type { ZodSchema } from "zod";

/** Valide et transforme le body/query/params d'une route avec un schéma Zod donné. */
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: "Données invalides",
        errors: result.error.flatten(),
      });
    }
    return result.data;
  }
}
