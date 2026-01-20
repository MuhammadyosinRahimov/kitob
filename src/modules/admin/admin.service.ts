import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [booksCount, usersCount, totalDownloads] = await Promise.all([
      this.prisma.book.count(),
      this.prisma.user.count(),
      this.prisma.book.aggregate({
        _sum: {
          downloadCount: true,
        },
      }),
    ]);

    return {
      booksCount,
      usersCount,
      totalDownloads: totalDownloads._sum.downloadCount || 0,
    };
  }

  async updateUserRole(userId: string, role: 'USER' | 'ADMIN' | 'SUPERADMIN') {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}
