import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('toggle')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Toggle favorite status for a book' })
  toggle(@Body('bookId') bookId: string, @Req() req) {
    return this.favoritesService.toggleFavorite(req.user.id, bookId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user favorites' })
  findAll(@Req() req) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }
}
