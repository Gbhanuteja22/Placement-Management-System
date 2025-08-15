import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
async function bootstrap() {
  console.log('🚀 Starting simplified API server...');
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    // Enable CORS
    app.enableCors({
      origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3004', 'http://localhost:3005'],
      credentials: true,
    });
    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    const port = process.env.PORT || 3007;
    console.log(`🌐 Starting server on port ${port}...`);
    await app.listen(port);
    console.log(`✅ Server successfully started!`);
    console.log(`🚀 API Server running on http://localhost:${port}`);
    console.log(`🏥 Health check available at http://localhost:${port}/health`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}
bootstrap();
