import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Sync Auth0 user to database
   * Creates user if doesn't exist, updates if changed
   */
  async syncAuth0User(auth0User: {
    userId: string;
    email: string;
    name: string;
  }) {
    const { userId: auth0Id, email, name } = auth0User;

    // Try to find existing user by auth0Id
    let user = await this.prisma.user.findUnique({
      where: { auth0Id },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    if (user) {
      // User exists - update email/name if changed
      if (user.email !== email || user.name !== name) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { email, name },
          include: {
            enrollments: {
              include: {
                course: true,
              },
            },
          },
        });
      }
    } else {
      // User doesn't exist - create new user
      user = await this.prisma.user.create({
        data: {
          auth0Id,
          email,
          name,
          emailVerified: new Date(), // Auth0 handles verification
        },
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
      });
    }

    return user;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
        submissions: true,
        grades: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
        submissions: {
          include: {
            assignment: true,
            grade: true,
          },
        },
        grades: true,
        reflectionResponses: true,
      },
    });
  }
}