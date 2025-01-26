import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('test/xiao')
  getNotifications(@Payload() data: number[], @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
    console.log('Data:', data);
    this.appService.saveDataToInfluxDB(data);
  }

  @Get('data')
  async getFromInfluxDB() {
    return await this.appService.getDataFromInfluxDB();
  }
}
