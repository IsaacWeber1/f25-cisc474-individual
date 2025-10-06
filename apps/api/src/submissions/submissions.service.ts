import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.submission.findMany({
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
    return await this.prisma.submission.findUnique({
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