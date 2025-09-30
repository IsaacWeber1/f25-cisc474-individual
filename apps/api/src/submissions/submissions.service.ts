import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SubmissionsService {
  async findAll() {
    return await prisma.submission.findMany({
      include: {
        assignment: {
          include: {
            course: true
          }
        },
        student: true,
        grade: {
          include: {
            gradedBy: true
          }
        },
        comments: {
          include: {
            user: true,
            parent: true
          }
        },
        reflectionResponse: {
          include: {
            template: true,
            selectedSkills: {
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
    return await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            course: true,
            createdBy: true
          }
        },
        student: true,
        grade: {
          include: {
            gradedBy: true,
            gradeChanges: {
              include: {
                changedBy: true
              }
            }
          }
        },
        comments: {
          include: {
            user: true,
            parent: true,
            replies: true
          }
        },
        reflectionResponse: {
          include: {
            template: {
              include: {
                skillTags: {
                  include: {
                    skillTag: true
                  }
                }
              }
            },
            selectedSkills: {
              include: {
                skillTag: true
              }
            }
          }
        }
      }
    });
  }
}