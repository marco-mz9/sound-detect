import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly influxDB: InfluxDB;
  constructor(
    @Inject('XIAO_CLIENT') private client: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.influxDB = new InfluxDB({
      url: process.env.INFLUXDB,
      token: process.env.INFLUXDB_TOKEN,
    });
  }

  async saveDataToInfluxDB(data: number[]) {
    const writeApi = this.influxDB.getWriteApi(
      this.configService.get('influxdbOrg'),
      this.configService.get('influxdbBucket'),
    );
    const point = new Point('esp32_data')
      .tag('device', 'ESP32-S3')
      .stringField('value', data);
    writeApi.writePoint(point);
    try {
      await writeApi.close();
    } catch (error) {
      console.error('Error al escribir en InfluxDB:', error);
    }
  }

  async getDataFromInfluxDB() {
    const queryApi = this.influxDB.getQueryApi('IT');
    const query = `from(bucket: "sound_detector")
      |> range(start: -5m)
      |> filter(fn: (r) => r._measurement == "esp32_data")
      |> sort(columns: ["_time"], desc: true)`;
    return await queryApi.collectRows(query);
  }
}
