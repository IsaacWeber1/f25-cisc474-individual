import { config } from 'dotenv';
import { resolve, join } from 'path';

// Load environment variables from .env file
// When compiled, __dirname will be in dist/, so we need to go up to the apps/api directory
const envPath = join(__dirname, '..', '.env');
config({ path: envPath });

// Also try loading from the root of the monorepo
config({ path: join(__dirname, '..', '..', '..', '.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS using environment variables
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3001',
        'http://localhost:3000',
        'https://f25-cisc474-individual-web-henna.vercel.app'
      ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 86400, // 24 hours
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || undefined;
  await app.listen(port, host);

  console.log(`🚀 API Server running on port ${port}`);
  console.log(`✅ CORS enabled for origins: ${allowedOrigins.join(', ')}`);
}

void bootstrap();
