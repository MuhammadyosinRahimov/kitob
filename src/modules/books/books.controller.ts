import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFiles, BadRequestException, UseGuards, Req, Patch, Delete } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new book with PDF and Cover Image' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'pdf', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
        return cb(new BadRequestException('Only PDF files are allowed for the book!'), false);
      }
      if (file.fieldname === 'cover' && !file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('Only image files are allowed for the cover!'), false);
      }
      cb(null, true);
    },
  }))
  create(
    @Body() createBookDto: CreateBookDto, 
    @UploadedFiles() files: { pdf?: Express.Multer.File[], cover?: Express.Multer.File[] }, 
    @Req() req
  ) {
    const pdfFile = files.pdf?.[0];
    const coverFile = files.cover?.[0];

    if (!pdfFile) {
      throw new BadRequestException('PDF file is required');
    }

    return this.booksService.create(createBookDto, {
      pdf: {
        path: pdfFile.path,
        filename: pdfFile.filename,
        size: pdfFile.size,
      },
      cover: coverFile ? {
        path: coverFile.path,
        filename: coverFile.filename,
      } : undefined,
    }, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single book and increment download count' })
  findOne(@Param('id') id: string, @Req() req) {
    // We optionally take userId from token if present to track downloads
    return this.booksService.findOne(id, req.user?.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update book details' })
  update(@Param('id') id: string, @Body() updateBookDto: Partial<CreateBookDto>) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a book' })
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
