import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create a regular HTTP server
  app.setGlobalPrefix('api/v1'); // Optional: set a global prefix for your API routes
  app.enableCors();
  await app.listen(process.env.PORT); // Start the HTTP server on port 3000

  const mqttApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: process.env.MQTT_URL,
        subscribeOptions: {
          qos: 0,
        },
      },
    },
  );
  await mqttApp.listen(); // Start the MQTT microservice
}
bootstrap();
