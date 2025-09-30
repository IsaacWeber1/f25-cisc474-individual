import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AssignmentsService {
  async findAll() {
    return await prisma.assignment.findMany({
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
    return await prisma.assignment.findUnique({
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