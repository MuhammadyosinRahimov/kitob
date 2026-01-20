import { Module } from '@nestjs/common';
import { BooksModule } from './modules/books/books.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { StorageModule } from './modules/storage/storage.service.module';

@Module({
  imports: [BooksModule, UsersModule, AuthModule, AdminModule, CategoriesModule, FavoritesModule, StorageModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
