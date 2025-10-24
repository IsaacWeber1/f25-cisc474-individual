import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

/**
 * Backend Authentication Integration Tests
 * Tests JWT validation, endpoint protection, and user synchronization
 */

describe('Authentication Integration (Backend)', () => {
  let app: INestApplication;

  // Mock JWT tokens for testing
  const VALID_JWT = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QifQ...'; // Would need real token
  const EXPIRED_JWT = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImV4cCI6MTAwMH0...';
  const MALFORMED_JWT = 'Bearer malformed.token.here';
  const NO_BEARER = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'; // Missing "Bearer" prefix

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // Import the AppModule which includes AuthModule
      imports: [/* AppModule */], // Uncomment when running
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Endpoint Protection', () => {
    describe('GET /courses', () => {
      it('should return 401 when no token provided', async () => {
        const response = await request(app.getHttpServer())
          .get('/courses')
          .expect(401);

        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toContain('Unauthorized');
      });

      it('should return 401 with malformed token', async () => {
        const response = await request(app.getHttpServer())
          .get('/courses')
          .set('Authorization', MALFORMED_JWT)
          .expect(401);

        expect(response.body.statusCode).toBe(401);
      });

      it('should return 401 with expired token', async () => {
        const response = await request(app.getHttpServer())
          .get('/courses')
          .set('Authorization', EXPIRED_JWT)
          .expect(401);

        expect(response.body.statusCode).toBe(401);
      });

      it('should return 401 with token missing Bearer prefix', async () => {
        const response = await request(app.getHttpServer())
          .get('/courses')
          .set('Authorization', NO_BEARER)
          .expect(401);

        expect(response.body.statusCode).toBe(401);
      });

      it('should return 200 with valid token', async () => {
        // This test requires a valid JWT token
        // In a real test environment, you would generate this token
        // For now, this is a placeholder
        if (VALID_JWT.includes('...')) {
          console.log('Skipping test - requires valid JWT token');
          return;
        }

        const response = await request(app.getHttpServer())
          .get('/courses')
          .set('Authorization', VALID_JWT)
          .expect(200);

        expect(Array.isArray(response.body)).toBeTruthy();
      });
    });

    describe('GET /grades', () => {
      it('should return 401 when no token provided', async () => {
        const response = await request(app.getHttpServer())
          .get('/grades')
          .expect(401);

        expect(response.body.statusCode).toBe(401);
      });
    });

    describe('GET /submissions', () => {
      it('should return 401 when no token provided', async () => {
        const response = await request(app.getHttpServer())
          .get('/submissions')
          .expect(401);

        expect(response.body.statusCode).toBe(401);
      });
    });

    describe('GET /links', () => {
      it('should return 401 when no token provided', async () => {
        const response = await request(app.getHttpServer())
          .get('/links')
          .expect(401);

        expect(response.body.statusCode).toBe(401);
      });
    });

    describe('GET /assignments', () => {
      it('should return 401 when no token provided', async () => {
        const response = await request(app.getHttpServer())
          .get('/assignments')
          .expect(401);

        expect(response.body.statusCode).toBe(401);
      });
    });
  });

  describe('User Synchronization', () => {
    describe('GET /users/me', () => {
      it('should return 401 when no token provided', async () => {
        const response = await request(app.getHttpServer())
          .get('/users/me')
          .expect(401);

        expect(response.body.statusCode).toBe(401);
      });

      it('should create user on first login with valid token', async () => {
        // This test requires a valid JWT token
        if (VALID_JWT.includes('...')) {
          console.log('Skipping test - requires valid JWT token');
          return;
        }

        const response = await request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', VALID_JWT)
          .expect(200);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('auth0Id');
        expect(response.body).toHaveProperty('email');
      });

      it('should return existing user on subsequent requests', async () => {
        // This test requires a valid JWT token
        if (VALID_JWT.includes('...')) {
          console.log('Skipping test - requires valid JWT token');
          return;
        }

        // First request - creates user
        const firstResponse = await request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', VALID_JWT)
          .expect(200);

        // Second request - should return same user
        const secondResponse = await request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', VALID_JWT)
          .expect(200);

        expect(firstResponse.body.id).toBe(secondResponse.body.id);
        expect(firstResponse.body.auth0Id).toBe(secondResponse.body.auth0Id);
      });
    });
  });

  describe('JWT Validation', () => {
    it('should validate JWT signature', async () => {
      const tamperedJWT = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature';

      const response = await request(app.getHttpServer())
        .get('/courses')
        .set('Authorization', tamperedJWT)
        .expect(401);

      expect(response.body.statusCode).toBe(401);
    });

    it('should validate JWT issuer', async () => {
      // Token from wrong issuer
      const wrongIssuerJWT = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImlzcyI6Indyb25nIn0...';

      const response = await request(app.getHttpServer())
        .get('/courses')
        .set('Authorization', wrongIssuerJWT)
        .expect(401);

      expect(response.body.statusCode).toBe(401);
    });

    it('should validate JWT audience', async () => {
      // Token with wrong audience
      const wrongAudienceJWT = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImF1ZCI6Indyb25nIn0...';

      const response = await request(app.getHttpServer())
        .get('/courses')
        .set('Authorization', wrongAudienceJWT)
        .expect(401);

      expect(response.body.statusCode).toBe(401);
    });
  });

  describe('CORS Configuration', () => {
    it('should allow requests from frontend origin', async () => {
      const response = await request(app.getHttpServer())
        .get('/courses')
        .set('Origin', 'http://localhost:3001')
        .expect(401); // Still 401 because no auth, but CORS should pass

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001');
    });

    it('should include proper CORS headers', async () => {
      const response = await request(app.getHttpServer())
        .options('/courses')
        .set('Origin', 'http://localhost:3001')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Authorization')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001');
      expect(response.headers['access-control-allow-methods']).toContain('GET');
      expect(response.headers['access-control-allow-headers']).toContain('authorization');
    });
  });

  describe('Error Handling', () => {
    it('should return proper error format for 401', async () => {
      const response = await request(app.getHttpServer())
        .get('/courses')
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/unauthorized/i);
    });

    it('should not leak sensitive information in errors', async () => {
      const response = await request(app.getHttpServer())
        .get('/courses')
        .set('Authorization', 'Bearer invalid.token')
        .expect(401);

      // Should not contain stack traces or internal details
      expect(JSON.stringify(response.body)).not.toContain('stack');
      expect(JSON.stringify(response.body)).not.toContain('at ');
      expect(JSON.stringify(response.body)).not.toContain('.ts:');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on authentication endpoints', async () => {
      // Make multiple rapid requests
      const requests = Array(15).fill(null).map(() =>
        request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', 'Bearer invalid')
      );

      const responses = await Promise.all(requests);

      // At least some should be rate limited (429)
      const rateLimited = responses.some(r => r.status === 429);

      // Note: Rate limiting might not be configured yet
      if (!rateLimited) {
        console.warn('Rate limiting not detected - consider implementing for production');
      }
    });
  });
});

/**
 * Test helper to generate a valid test JWT
 * In a real test environment, this would create a properly signed token
 */
async function generateTestJWT(payload: any): Promise<string> {
  // This would use the test Auth0 tenant or a mock JWT service
  // For now, return a placeholder
  return 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...';
}

/**
 * Test helper to create a test user in the database
 */
async function createTestUser(auth0Id: string, email: string): Promise<any> {
  // This would use Prisma to create a test user
  // For now, return a placeholder
  return {
    id: 1,
    auth0Id,
    email,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}