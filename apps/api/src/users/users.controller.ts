import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(
    @CurrentUser() user: any,
    @Query('email') emailParam?: string,
    @Query('name') nameParam?: string,
    @Query('emailVerified') emailVerifiedParam?: string,
  ) {
    console.log('[UsersController] Received query params:', {
      emailParam,
      nameParam,
      emailVerifiedParam,
    });
    console.log('[UsersController] JWT user:', user);

    // Use query params as fallback if JWT doesn't include profile claims
    const userWithProfile = {
      ...user,
      email: user.email || emailParam,
      name: user.name || nameParam,
      emailVerified: emailVerifiedParam === 'true',
    };

    console.log('[UsersController] Final userWithProfile:', userWithProfile);

    // Sync Auth0 user to database and return database record
    return this.usersService.syncAuth0User(userWithProfile);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}