import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Sync Auth0 user to database
   * Creates user if doesn't exist, updates if changed
   */
  /**
   * Get or create user by Auth0 ID only (when email/name not available in JWT)
   * This is used by controllers that don't have access to email/name in the JWT token
   */
  async getUserByAuth0Id(auth0Id: string) {
    console.log('[getUserByAuth0Id] Looking up user:', auth0Id);

    const user = await this.prisma.user.findUnique({
      where: { auth0Id },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error(
        `User with Auth0 ID ${auth0Id} not found. User must complete profile setup first by visiting /users/me endpoint.`,
      );
    }

    console.log('[getUserByAuth0Id] Found user:', user.id);
    return user;
  }

  async syncAuth0User(auth0User: {
    userId: string;
    email: string;
    name: string;
    emailVerified?: boolean;
  }) {
    const { userId: auth0Id, email, name, emailVerified } = auth0User;

    console.log('[syncAuth0User] Starting sync for:', { auth0Id, email, name });

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

    console.log('[syncAuth0User] Found by auth0Id?', !!user);

    if (user) {
      // User exists by auth0Id - update email/name if changed
      console.log('[syncAuth0User] User found, checking if update needed', {
        currentEmail: user.email,
        newEmail: email,
        currentName: user.name,
        newName: name,
      });

      // Only update if email and name are provided and different
      if (email && name && (user.email !== email || user.name !== name)) {
        console.log('[syncAuth0User] Updating user with new email/name');
        try {
          // Check if another user already has the target email (likely a seeded user)
          const conflictingUser = await this.prisma.user.findUnique({
            where: { email },
          });

          if (conflictingUser && conflictingUser.id !== user.id) {
            // Seeded user exists with this email and has valuable data (enrollments, submissions, etc.)
            // Delete the Auth0 placeholder user (current 'user') instead, and use the seeded user
            console.log(
              '[syncAuth0User] Deleting Auth0 placeholder user and using seeded user:',
              user.id,
            );
            await this.prisma.user.delete({
              where: { id: user.id },
            });

            // Update the seeded user with auth0Id
            user = await this.prisma.user.update({
              where: { id: conflictingUser.id },
              data: {
                auth0Id,
                name, // Update name in case it changed
                emailVerified: emailVerified ? new Date() : null,
              },
              include: {
                enrollments: {
                  include: {
                    course: true,
                  },
                },
              },
            });
            console.log('[syncAuth0User] Successfully updated seeded user with auth0Id');
          } else {
            // No conflict, just update email/name/emailVerified
            user = await this.prisma.user.update({
              where: { id: user.id },
              data: {
                email,
                name,
                emailVerified: emailVerified ? new Date() : null,
              },
              include: {
                enrollments: {
                  include: {
                    course: true,
                  },
                },
              },
            });
            console.log('[syncAuth0User] User updated successfully');
          }
        } catch (error: any) {
          console.error('[syncAuth0User] Update failed with full error details:');
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error code:', error.code);
          console.error('Error meta:', error.meta);
          console.error('Full error object:', JSON.stringify(error, null, 2));

          // Log the data that was being used in the failed update
          console.error('Failed update data:', {
            email,
            name,
            emailVerified,
            emailVerifiedDate: emailVerified ? new Date() : null,
            currentUserId: user.id
          });
          throw error;
        }
      } else {
        console.log('[syncAuth0User] No update needed, email/name unchanged');
      }
    } else {
      // Not found by auth0Id, try to find by email (for seeded users)
      // Only attempt email lookup if email is provided
      if (email) {
        console.log('[syncAuth0User] Not found by auth0Id, trying email:', email);
        user = await this.prisma.user.findUnique({
          where: { email },
          include: {
            enrollments: {
              include: {
                course: true,
              },
            },
          },
        });
      } else {
        console.log('[syncAuth0User] Not found by auth0Id and no email provided');
        user = null;
      }

      console.log('[syncAuth0User] Found by email?', !!user);

      if (user) {
        // Found by email - this is a seeded user, check if we need to update
        console.log('[syncAuth0User] Found seeded user:', {
          id: user.id,
          currentAuth0Id: user.auth0Id,
          newAuth0Id: auth0Id,
          currentName: user.name,
          newName: name,
        });

        // Check if any update is actually needed
        const needsUpdate = user.auth0Id !== auth0Id || user.name !== name;

        if (needsUpdate) {
          console.log('[syncAuth0User] Updating seeded user with auth0Id:', user.id);
          console.log('[syncAuth0User] Update data:', {
            auth0Id,
            name,
            emailVerified,
            emailVerifiedDate: emailVerified ? new Date() : null,
          });

          try {
            user = await this.prisma.user.update({
              where: { id: user.id },
              data: {
                auth0Id,
                name, // Update name in case it changed
                emailVerified: emailVerified ? new Date() : null,
              },
              include: {
                enrollments: {
                  include: {
                    course: true,
                  },
                },
              },
            });
            console.log('[syncAuth0User] Successfully updated user');
          } catch (error: any) {
            console.error('[syncAuth0User] Seeded user update failed with full error details:');
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error code:', error.code);
            console.error('Error meta:', error.meta);
            console.error('Full error object:', JSON.stringify(error, null, 2));
            console.error('Failed update data:', {
              auth0Id,
              name,
              emailVerified,
              emailVerifiedDate: emailVerified ? new Date() : null,
              currentUserId: user.id
            });
            throw error;
          }
        } else {
          console.log('[syncAuth0User] No update needed for seeded user - auth0Id and name are already correct');
        }
      } else {
        // User doesn't exist at all - create new user
        console.log('[syncAuth0User] Creating new user');
        user = await this.prisma.user.create({
          data: {
            auth0Id,
            email,
            name,
            emailVerified: emailVerified ? new Date() : null,
          },
          include: {
            enrollments: {
              include: {
                course: true,
              },
            },
          },
        });
        console.log('[syncAuth0User] Successfully created user');
      }
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

  async findByAuth0Id(auth0Id: string) {
    return await this.prisma.user.findUnique({
      where: { auth0Id },
    });
  }
}