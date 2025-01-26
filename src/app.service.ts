import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

@Injectable()
export class AppService {
  private readonly influxDB: InfluxDB;
  constructor(@Inject('XIAO_CLIENT') private client: ClientProxy) {
    this.influxDB = new InfluxDB({
      url: 'http://localhost:8086',
      token:
        'ptScm7qdVHVNzDF-E049WchXWgPb1AG7YKww_KsJ1n8sTkbeYHN2TK_weyLc4gF5V1J1L6EMOf4XvhhFJt9Cpw==',
    });
  }

  async saveDataToInfluxDB(data: number[]) {
    const writeApi = this.influxDB.getWriteApi('IT', 'sound_detector');
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
    const result = await queryApi.collectRows(query);
    return result;
  }
}
