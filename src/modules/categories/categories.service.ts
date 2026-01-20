import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(name: string) {
    return this.prisma.category.create({
      data: { name },
    });
  }

  async remove(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
