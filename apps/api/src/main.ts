import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global prefix
    app.setGlobalPrefix('api');

    // CORS
    app.enableCors({
        origin: process.env.DASHBOARD_URL || 'http://localhost:3000',
        credentials: true,
    });

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Swagger API documentation
    const config = new DocumentBuilder()
        .setTitle('ServerMG API')
        .setDescription('Self-hosted SaaS Hosting Platform API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.API_PORT || 4000;
    await app.listen(port);
    console.log(`🚀 ServerMG API running on port ${port}`);
    console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
}
bootstrap();
