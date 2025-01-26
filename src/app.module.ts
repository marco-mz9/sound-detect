import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'XIAO_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://broker.emqx.io:1883',
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
