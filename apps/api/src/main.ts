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
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || undefined;
  await app.listen(port, host);

  console.log(`🚀 API Server running on port ${port}`);
  console.log(`✅ CORS enabled for origins: ${allowedOrigins.join(', ')}`);
}

void bootstrap();
