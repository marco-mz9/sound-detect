import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create a regular HTTP server
  app.setGlobalPrefix('api/v1'); // Optional: set a global prefix for your API routes
  app.enableCors();
  await app.listen(3000); // Start the HTTP server on port 3000
  console.log('Servidor HTTP iniciado en http://localhost:3000');

  const mqttApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://broker.emqx.io:1883',
        subscribeOptions: {
          qos: 0,
        },
      },
    },
  );
  await mqttApp.listen(); // Start the MQTT microservice
  console.log('Microservice MQTT conectado');
}
bootstrap();
