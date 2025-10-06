import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
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
    return await this.prisma.user.findUnique({
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