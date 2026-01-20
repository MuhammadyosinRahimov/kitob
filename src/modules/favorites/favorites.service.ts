import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggleFavorite(userId: string, bookId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existing) {
      return this.prisma.favorite.delete({
        where: { id: existing.id },
      });
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        bookId,
      },
    });
  }

  async getUserFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        book: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
