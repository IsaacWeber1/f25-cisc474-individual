import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async findAll() {
    return await prisma.user.findMany({
      include: {
        enrollments: {
          include: {
            course: true
          }
        },
        submissions: true,
        grades: true
      }
    });
  }

  async findOne(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: true
          }
        },
        submissions: {
          include: {
            assignment: true,
            grade: true
          }
        },
        grades: true,
        reflectionResponses: true
      }
    });
  }
}