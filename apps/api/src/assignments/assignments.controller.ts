import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';
import { UsersService } from '../users/users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import type {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentResponse,
} from '@repo/api/assignments';
import type { DeleteResponse } from '@repo/api/common';

@Controller('assignments')
@UseGuards(AuthGuard('jwt')) // Protect all routes in this controller
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * GET /assignments
   * Get all assignments
   */
  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  /**
   * GET /assignments/:id
   * Get single assignment by ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  /**
   * POST /assignments
   * Create new assignment
   *
   * @param dto - Assignment creation data
   * @returns Created assignment with relations
   */
  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateAssignmentDto,
  ): Promise<AssignmentResponse> {
    // Get database user by Auth0 ID (JWT token doesn't include email/name)
    // User must have visited /users/me endpoint at least once to have a database record
    const dbUser = await this.usersService.getUserByAuth0Id(user.userId);
    return await this.assignmentsService.create(dto, dbUser.id);
  }

  /**
   * PATCH /assignments/:id
   * Update existing assignment
   *
   * @param id - Assignment ID
   * @param dto - Update data (partial)
   * @returns Updated assignment
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAssignmentDto,
  ): Promise<AssignmentResponse> {
    return await this.assignmentsService.update(id, dto);
  }

  /**
   * DELETE /assignments/:id
   * Delete assignment by ID
   *
   * @param id - Assignment ID
   * @returns Deletion confirmation
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResponse> {
    return await this.assignmentsService.delete(id);
  }
}