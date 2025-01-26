import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
    }),
    ClientsModule.register([
      {
        name: 'XIAO_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL,
          subscribeOptions: {
            qos: 0,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
