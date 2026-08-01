import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import type { Env } from "../../../config/env.validation";

/** Préfixe de tous les public_id créés par l'application — sert de garde-fou
 * à la suppression (un admin ne peut détruire que des assets uploadés par
 * l'app, jamais un public_id arbitraire du compte Cloudinary). */
export const CLOUDINARY_PUBLIC_ID_PREFIX = "mimicherry-products-";

@Injectable()
export class CloudinaryService {
  private readonly configured: boolean;

  constructor(config: ConfigService<Env, true>) {
    const cloudName = config.get("CLOUDINARY_CLOUD_NAME", { infer: true });
    const apiKey = config.get("CLOUDINARY_API_KEY", { infer: true });
    const apiSecret = config.get("CLOUDINARY_API_SECRET", { infer: true });
    this.configured = Boolean(cloudName && apiKey && apiSecret);

    if (this.configured) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    }
  }

  private assertConfigured(): void {
    if (!this.configured) {
      throw new InternalServerErrorException(
        "Le stockage d'images (Cloudinary) n'est pas configuré sur ce serveur.",
      );
    }
  }

  uploadBuffer(buffer: Buffer, publicId: string): Promise<UploadApiResponse> {
    this.assertConfigured();
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: publicId, resource_type: "image", overwrite: false },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Échec de l'upload Cloudinary."));
            return;
          }
          resolve(result);
        },
      );
      stream.end(buffer);
    });
  }

  async destroy(publicId: string): Promise<void> {
    this.assertConfigured();
    await cloudinary.uploader.destroy(publicId);
  }
}
