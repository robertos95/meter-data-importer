import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as readline from 'readline';
import { Repository } from 'typeorm';
import createReadlineInterface from '../helper/create-readline-interface';
import { CreateMeterReadingDto } from './dto/create-meter-reading.dto';
import { MeterReadings } from './entities/meter-readings.entity';

@Injectable()
export class MeterReadingsService {
  constructor(
    @InjectRepository(MeterReadings)
    private meterReadingsRepository: Repository<MeterReadings>,
  ) {}

  async create(createMeterReadingDto: CreateMeterReadingDto) {
    // Skip if the record already exists, this allows to re-import the same file in case processing error happens halfway
    const existingMeterReading = await this.meterReadingsRepository.findOne({
      where: {
        nmi: createMeterReadingDto.nmi,
        nmiSuffix: createMeterReadingDto.nmiSuffix,
        timestamp: createMeterReadingDto.timestamp,
      },
    });

    if (existingMeterReading) {
      return;
    }

    const newMeterReading = this.meterReadingsRepository.create(
      createMeterReadingDto,
    );

    return await this.meterReadingsRepository.save(newMeterReading);
  }

  async importMeterReadingsFromFile(filePath): Promise<void> {
    const rl = createReadlineInterface(filePath);

    await this.processRecords(rl);
  }

  protected async processRecords(rl: readline.Interface) {
    let recordData = {
      nmi: '',
      nmiSuffix: '',
      intervalInMins: 0,
      nrOfIntervalValues: 0,
      dateMins: 0,
    };

    for await (const line of rl) {
      const [recordIndicator, ...otherFields] = line.split(',');

      if (recordIndicator === '200') {
        recordData = this.processType200Record(otherFields);
      } else if (recordIndicator === '300') {
        await this.processType300Record(otherFields, recordData);
      } // Assumption: No need to do anything for other kind of records
    }
  }

  protected processType200Record(fields: string[]) {
    const nmi = fields[0];
    const nmiSuffix = fields[3];
    const intervalInMins = +fields[7];
    const nrOfIntervalValues = (24 * 60) / intervalInMins;

    return { nmi, nmiSuffix, intervalInMins, nrOfIntervalValues, dateMins: 0 };
  }

  protected async processType300Record(fields: string[], recordData: any) {
    // Assumption: Date is in GMT+0
    const dateTime = new Date(
      parseInt(fields[0].substring(0, 4)), // year
      parseInt(fields[0].substring(4, 6)) - 1, // month, zero-based
      parseInt(fields[0].substring(6, 8)), // day
    ).getTime();

    for (let i = 1; i < recordData.nrOfIntervalValues + 1; i++) {
      await this.create({
        nmi: recordData.nmi,
        nmiSuffix: recordData.nmiSuffix,
        timestamp: new Date(dateTime + recordData.dateMins * 60000),
        consumption: +fields[i],
      });
      recordData.dateMins += recordData.intervalInMins;
    }

    recordData.dateMins = 0;
  }
}
