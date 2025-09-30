import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class GradesService {
  async findAll() {
    return await prisma.grade.findMany({
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
    return await prisma.grade.findUnique({
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