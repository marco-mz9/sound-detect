import * as process from 'node:process';

export const envConfig = () => ({
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3002,
  influxdb: process.env.INFLUXDB,
  influxdbToken: process.env.INFLUXDB_TOKEN,
  influxdbOrg: process.env.INFLUXDB_ORG,
  influxdbBucket: process.env.INFLUXDB_BUCKET,
  mqttUrl: process.env.MQTT_URL,
});
