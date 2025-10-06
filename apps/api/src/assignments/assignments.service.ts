import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.assignment.findMany({
      include: {
        course: true,
        createdBy: true,
        submissions: {
          include: {
            student: true,
            grade: true
          }
        },
        reflectionTemplate: {
          include: {
            skillTags: {
              include: {
                skillTag: true
              }
            }
          }
        }
      }
    });
  }

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
                gradedBy: true
              }
            },
            comments: {
              include: {
                user: true
              }
            }
          }
        },
        reflectionTemplate: {
          include: {
            skillTags: {
              include: {
                skillTag: true
              }
            },
            responses: true
          }
        }
      }
    });
  }
}