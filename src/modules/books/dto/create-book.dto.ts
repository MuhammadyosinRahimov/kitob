import { IsString, IsNotEmpty, IsInt, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  // These will be populated by the backend after file upload usually, 
  // but for the DTO we might receive them or handle them in controller.
  // In this implementation, the controller will set them from the uploaded file.
}
