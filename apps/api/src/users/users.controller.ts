import { Controller, Get, Patch, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard, CurrentUser, Roles } from '../auth/decorators';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    async getProfile(@CurrentUser() user: any) {
        const profile = await this.usersService.findById(user.id);
        return { success: true, data: profile };
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    async updateProfile(@CurrentUser() user: any, @Body() data: { name?: string; avatar?: string }) {
        const updated = await this.usersService.updateProfile(user.id, data);
        return { success: true, data: updated };
    }

    @Patch('me/password')
    @ApiOperation({ summary: 'Change password' })
    async changePassword(@CurrentUser() user: any, @Body() data: { password: string }) {
        await this.usersService.changePassword(user.id, data.password);
        return { success: true, message: 'Password updated' };
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'List all users (admin)' })
    async listAll(@Query('page') page?: string, @Query('limit') limit?: string) {
        const result = await this.usersService.listAllUsers(
            parseInt(page || '1'), parseInt(limit || '20'),
        );
        return { success: true, data: result.users, meta: { total: result.total, page: result.page, limit: result.limit } };
    }
}
