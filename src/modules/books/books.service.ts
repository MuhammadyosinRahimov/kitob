import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { StorageService } from '../storage/storage.service';


@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService
  ) {}

  async create(
    data: CreateBookDto, 
    files: { 
      pdf: Express.Multer.File,
      cover?: Express.Multer.File
    }, 
    userId: string
  ): Promise<Book> {
    const pdfUrl = await this.storageService.saveFile(files.pdf);
    let coverImageUrl = null;
    
    if (files.cover) {
      coverImageUrl = await this.storageService.saveFile(files.cover);
    }

    return this.prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        description: data.description,
        difficulty: data.difficulty,
        language: data.language,
        categoryId: data.categoryId,
        createdById: userId,
        
        // Cloud URLs
        pdfUrl: pdfUrl,
        pdfFileName: files.pdf.originalname,
        fileSize: files.pdf.size,
        coverImageUrl: coverImageUrl,
        
        // Default or calculated
        pageCount: 0,
      },
    });
  }

  async findAll(): Promise<Book[]> {
    return this.prisma.book.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string): Promise<Book | null> {
    const book = await this.prisma.book.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
      include: {
        category: true,
      },
    });

    if (userId && book) {
      await this.prisma.download.create({
        data: {
          userId,
          bookId: id,
        },
      });
    }

    return book;
  }

  async update(id: string, data: Partial<CreateBookDto>): Promise<Book> {
    return this.prisma.book.update({
      where: { id },
      data: {
        ...data,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string): Promise<Book> {
    const book = await this.prisma.book.findUnique({ where: { id } });
    
    if (book) {
      // Delete physical files
      if (book.pdfUrl) await this.storageService.deleteFile(book.pdfUrl);
      if (book.coverImageUrl) await this.storageService.deleteFile(book.coverImageUrl);
    }

    // Delete associated downloads and favorites
    await this.prisma.download.deleteMany({ where: { bookId: id } });
    await this.prisma.favorite.deleteMany({ where: { bookId: id } });
    
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
