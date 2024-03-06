import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1709726454100 implements MigrationInterface {
  name = 'InitialMigration1709726454100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "meter_readings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nmi" character varying(10) NOT NULL, "nmi_suffix" character varying(2) NOT NULL, "timestamp" TIMESTAMP NOT NULL, "consumption" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "meter_readings_unique_consumption" UNIQUE ("nmi", "nmi_suffix", "timestamp"), CONSTRAINT "PK_e1a17bbc8bfc32c9d70adc7c2bc" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "meter_readings"`);
  }
}
