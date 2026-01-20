import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from '../../prisma.service';
import { StorageModule } from '../storage/storage.service.module';

@Module({
  imports: [StorageModule],
  controllers: [BooksController],
  providers: [BooksService, PrismaService],
})
export class BooksModule {}
