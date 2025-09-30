import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CoursesService {
  async findAll() {
    return await prisma.course.findMany({
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
    return await prisma.course.findUnique({
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