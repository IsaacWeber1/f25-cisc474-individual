import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentResponse,
} from '@repo/api/assignments';
import type { DeleteResponse } from '@repo/api/common';
import {
  transformDates,
  extractUserReference,
  extractCourseReference,
} from '../common/dto-transformer';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all assignments with relations
   * Returns full data including nested submissions, reflections, etc.
   */
  async findAll() {
    return await this.prisma.assignment.findMany({
      include: {
        course: true,
        createdBy: true,
        submissions: {
          include: {
            student: true,
            grade: true,
          },
        },
        reflectionTemplate: {
          include: {
            skillTags: {
              include: {
                skillTag: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Find single assignment by ID with full relations
   */
  async findOne(id: string) {
    return await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true,
        createdBy: true,
        submissions: {
          include: {
            student: true,
            grade: {
              include: {
                gradedBy: true,
              },
            },
            comments: {
              include: {
                user: true,
              },
            },
          },
        },
        reflectionTemplate: {
          include: {
            skillTags: {
              include: {
                skillTag: true,
              },
            },
            responses: true,
          },
        },
      },
    });
  }

  /**
   * Create new assignment
   *
   * @param dto - Assignment creation data
   * @param userId - ID of user creating the assignment
   * @returns Created assignment with relations
   */
  async create(
    dto: CreateAssignmentDto,
    userId: string,
  ): Promise<AssignmentResponse> {
    // Convert ISO string to Date object for Prisma
    const dueDate = new Date(dto.dueDate);

    // Create assignment with relations
    const assignment = await this.prisma.assignment.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        maxPoints: dto.maxPoints,
        dueDate,
        instructions: dto.instructions || null,
        isPublished: dto.isPublished,
        courseId: dto.courseId,
        createdById: userId,
      },
      include: {
        course: true,
        createdBy: true,
      },
    });

    // Transform to DTO format
    return this.transformToResponse(assignment);
  }

  /**
   * Update existing assignment
   *
   * @param id - Assignment ID
   * @param dto - Update data (partial)
   * @returns Updated assignment with relations
   */
  async update(
    id: string,
    dto: UpdateAssignmentDto,
  ): Promise<AssignmentResponse> {
    // Check if assignment exists
    const existing = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    // Prepare update data
    const updateData: Record<string, unknown> = { ...dto };

    // Convert dueDate ISO string to Date if provided
    if (dto.dueDate) {
      updateData.dueDate = new Date(dto.dueDate);
    }

    // Update assignment
    const assignment = await this.prisma.assignment.update({
      where: { id },
      data: updateData,
      include: {
        course: true,
        createdBy: true,
      },
    });

    // Transform to DTO format
    return this.transformToResponse(assignment);
  }

  /**
   * Delete assignment by ID
   *
   * @param id - Assignment ID
   * @returns Confirmation of deletion
   */
  async delete(id: string): Promise<DeleteResponse> {
    // Check if assignment exists
    const existing = await this.prisma.assignment.findUnique({
      where: { id },
      select: { id: true, title: true },
    });

    if (!existing) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    // Delete assignment (cascade will handle related records)
    await this.prisma.assignment.delete({
      where: { id },
    });

    return {
      id,
      deleted: true,
      message: `Assignment "${existing.title}" deleted successfully`,
    };
  }

  /**
   * Transform Prisma assignment to AssignmentResponse DTO
   * Handles date conversion and nested relation simplification
   */
  private transformToResponse(assignment: {
    id: string;
    title: string;
    description: string;
    type: string;
    maxPoints: number;
    dueDate: Date;
    instructions: unknown;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    courseId: string;
    createdById: string;
    course: { id: string; code: string; title: string; semester: string };
    createdBy: { id: string; name: string; email: string };
  }): AssignmentResponse {
    // Transform dates to ISO strings and build response
    const response: AssignmentResponse = {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      type: assignment.type as 'FILE' | 'TEXT' | 'REFLECTION',
      maxPoints: assignment.maxPoints,
      dueDate: assignment.dueDate.toISOString(),
      instructions: assignment.instructions as Array<string> | null,
      isPublished: assignment.isPublished,
      createdAt: assignment.createdAt.toISOString(),
      updatedAt: assignment.updatedAt.toISOString(),
      courseId: assignment.courseId,
      createdById: assignment.createdById,
      course: extractCourseReference(assignment.course)!,
      createdBy: extractUserReference(assignment.createdBy)!,
    };

    return response;
  }
}