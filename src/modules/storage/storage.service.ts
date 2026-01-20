import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly uploadDir = './uploads';

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    // In a real cloud implementation (S3/GCS), you would upload the file here.
    // For now, we are using the local path provided by Multer diskStorage,
    // but the abstraction allows easy switching.
    return `/uploads/${file.filename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split('/').pop();
    if (fileName) {
      const filePath = path.join(this.uploadDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
}
