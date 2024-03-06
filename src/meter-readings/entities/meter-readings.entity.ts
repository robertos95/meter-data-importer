import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('meter_readings')
@Unique('meter_readings_unique_consumption', ['nmi', 'nmiSuffix', 'timestamp'])
export class MeterReadings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  nmi: string;

  @Column({ type: 'varchar', length: 2 })
  nmiSuffix: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'numeric' })
  consumption: number;

  // Nice to have, to see when the row is created
  @CreateDateColumn()
  createdAt: Date;
}
