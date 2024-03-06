import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { MeterReadingsModule } from './meter-readings/meter-readings.module';
import { MeterReadingsService } from './meter-readings/meter-readings.service';
import { dataSourceOptions } from './typeorm.config';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOptions,
      }),
    }),
    MeterReadingsModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly meterReadingService: MeterReadingsService) {}

  async onModuleInit() {
    try {
      const filePath = process.env.FILE_PATH;
      await this.meterReadingService.importMeterReadingsFromFile(filePath);
    } catch (error) {
      console.error('Error importing meter readings from the file:', error);
    }
  }
}
