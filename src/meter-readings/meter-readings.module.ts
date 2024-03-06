import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeterReadings } from './entities/meter-readings.entity';
import { MeterReadingsService } from './meter-readings.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeterReadings])],
  providers: [MeterReadingsService],
  exports: [MeterReadingsService],
})
export class MeterReadingsModule {}
