import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as readline from 'readline';
import createReadlineInterface from '../helper/create-readline-interface';
import { MeterReadings } from './entities/meter-readings.entity';
import { MeterReadingsService } from './meter-readings.service';

class TestMeterReadingsService extends MeterReadingsService {
  public async testProcessRecords(rl: readline.Interface) {
    return this.processRecords(rl);
  }

  public testProcessType200Record(fields: string[]) {
    return this.processType200Record(fields);
  }

  public async testProcessType300Record(fields: string[], recordData: any) {
    return this.processType300Record(fields, recordData);
  }
}

describe('MeterReadingsService', () => {
  let service: TestMeterReadingsService;
  let repository;

  const mockRepository = () => ({
    create: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestMeterReadingsService,
        {
          provide: getRepositoryToken(MeterReadings),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TestMeterReadingsService>(TestMeterReadingsService);
    repository = module.get(getRepositoryToken(MeterReadings));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new meter reading', async () => {
      const dto = {
        nmi: 'test',
        nmiSuffix: 'test',
        timestamp: new Date(),
        consumption: 10,
      };

      const createdMeterReading = {
        id: '85b3ef0a-f716-4daa-95f1-323867b2671f',
      };

      repository.create.mockResolvedValue(createdMeterReading);
      repository.save.mockResolvedValue(createdMeterReading);

      const result = await service.create(dto);

      expect(result).toEqual(createdMeterReading);
    });
  });

  describe('processRecords', () => {
    it('should process records', async () => {
      const rl = createReadlineInterface(
        './src/meter-readings/sample-file.csv',
      );

      // Create a spy on testProcessType200Record
      const process200RecordSpy = jest.spyOn(
        service as any,
        'processType200Record',
      );
      const process300RecordSpy = jest.spyOn(
        service as any,
        'processType300Record',
      );

      await service.testProcessRecords(rl);

      // Check if the process200RecordSpy was called twice and process300RecordSpy was called 8 times
      expect(process200RecordSpy).toHaveBeenCalledTimes(2);
      expect(process300RecordSpy).toHaveBeenCalledTimes(8);

      // Restore the original function
      process200RecordSpy.mockRestore();
      process300RecordSpy.mockRestore();
    });
  });

  describe('processType200Record', () => {
    it('should process type 200 record', () => {
      const result = service.testProcessType200Record([
        'NEM1201009',
        'E1E2',
        '1',
        'E1',
        'N1',
        '01009',
        'kWh',
        '30',
        '20050610',
      ]);
      expect(result).toEqual({
        nmi: 'NEM1201009',
        nmiSuffix: 'E1',
        intervalInMins: 30,
        nrOfIntervalValues: 48,
        dateMins: 0,
      });
    });
  });

  describe('processType300Record', () => {
    it('should process type 300 record and create 48 readings on the DB for 30 mins interval data', async () => {
      const recordData = {
        nmi: 'NEM1201009',
        nmiSuffix: 'E1',
        intervalInMins: 30,
        nrOfIntervalValues: 48,
        dateMins: 0,
      };

      await service.testProcessType300Record(
        [
          '20050301',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0.461',
          '0.810',
          '0.568',
          '1.234',
          '1.353',
          '1.507',
          '1.344',
          '1.773',
          '0.848',
          '1.271',
          '0.895',
          '1.327',
          '1.013',
          '1.793',
          '0.988',
          '0.985',
          '0.876',
          '0.555',
          '0.760',
          '0.938',
          '0.566',
          '0.512',
          '0.970',
          '0.760',
          '0.731',
          '0.615',
          '0.886',
          '0.531',
          '0.774',
          '0.712',
          '0.598',
          '0.670',
          '0.587',
          '0.657',
          '0.345',
          '0.231',
          'A',
          '',
          '',
          '20050310121004',
          '20050310182204',
        ],
        recordData,
      );

      expect(repository.create).toHaveBeenCalledTimes(48);
    });
  });
});
