import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.course.findMany({
      include: {
        createdBy: true,
        enrollments: {
          include: {
            user: true
          }
        },
        assignments: {
          include: {
            submissions: true
          }
        }
      }
    });
  }

  async findOne(id: string) {
    return await this.prisma.course.findUnique({
      where: { id },
      include: {
        createdBy: true,
        enrollments: {
          include: {
            user: true
          }
        },
        assignments: {
          include: {
            submissions: {
              include: {
                student: true,
                grade: true
              }
            }
          }
        }
      }
    });
  }
}