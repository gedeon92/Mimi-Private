import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { randomUUID } from "crypto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../../common/decorators/roles.decorator";
import { CloudinaryService, CLOUDINARY_PUBLIC_ID_PREFIX } from "./cloudinary.service";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin/uploads")
export class UploadsController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME.includes(file.mimetype)) {
          cb(new BadRequestException("Format d'image non supporté (jpeg, png, webp uniquement)."), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Aucun fichier reçu.");
    const publicId = `${CLOUDINARY_PUBLIC_ID_PREFIX}${randomUUID()}`;
    const result = await this.cloudinary.uploadBuffer(file.buffer, publicId);
    return { url: result.secure_url, publicId: result.public_id };
  }

  @Delete(":publicId")
  async remove(@Param("publicId") publicId: string) {
    if (!publicId.startsWith(CLOUDINARY_PUBLIC_ID_PREFIX)) {
      throw new BadRequestException("Identifiant d'image invalide.");
    }
    await this.cloudinary.destroy(publicId);
    return { success: true };
  }
}
