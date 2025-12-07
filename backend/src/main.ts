import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'; // 👈 Importa esto

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en DTO
      forbidNonWhitelisted: true, // lanza error si llegan propiedades no esperadas
      transform: true, // convierte tipos automáticamente (string -> number, etc.)
    }),
  );

  // 🔧 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Documentación API')
    .setDescription('API desarrollada con NestJS y Swagger')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 🔧 Habilitar CORS
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://192.168.0.4:3001', // ← Reemplaza con la IP de tu PC
      // Agrega aquí otras IPs que necesites
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`🚀 La aplicación está corriendo en: http://localhost:3000`);
  console.log(`📡 También accesible desde: http://192.168.0.4:3000`);
  console.log(`📄 Swagger disponible en: http://localhost:3000/api-docs`);
}

bootstrap();
