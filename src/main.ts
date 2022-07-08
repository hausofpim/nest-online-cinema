import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .addBearerAuth()
    .addServer('/api')
    .setTitle('Online Cinema API')
    .setDescription('Описание API сервисов для Онлайн кинотеатра')
    .addTag('users')
    .addTag('auth')
    .addTag('files')
    .addTag('genres')
    .addTag('actors')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)
  app.setGlobalPrefix('api')
  await app.listen(4200)
}
bootstrap()
