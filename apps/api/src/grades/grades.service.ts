import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.grade.findMany({
      include: {
        submission: {
          include: {
            assignment: {
              include: {
                course: true
              }
            },
            student: true
          }
        },
        gradedBy: true,
        gradeChanges: {
          include: {
            changedBy: true
          }
        }
      }
    });
  }

  async findOne(id: string) {
    return await this.prisma.grade.findUnique({
      where: { id },
      include: {
        submission: {
          include: {
            assignment: {
              include: {
                course: true,
                createdBy: true
              }
            },
            student: true
          }
        },
        gradedBy: true,
        gradeChanges: {
          include: {
            changedBy: true
          },
          orderBy: {
            changedAt: 'desc'
          }
        }
      }
    });
  }
}