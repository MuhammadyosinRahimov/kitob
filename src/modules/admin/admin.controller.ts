import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// We would usually have a RolesGuard here too, but for MVP we might just check in the service or use a simple Guard.

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  getStats() {
    return this.adminService.getStats();
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role' })
  updateRole(@Param('id') id: string, @Body('role') role: 'USER' | 'ADMIN' | 'SUPERADMIN') {
    return this.adminService.updateUserRole(id, role);
  }
}
