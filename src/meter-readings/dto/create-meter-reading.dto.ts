import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateMeterReadingDto {
  @IsString()
  @IsNotEmpty()
  nmi: string;

  @IsString()
  @IsNotEmpty()
  nmiSuffix: string;

  @IsDate()
  @IsNotEmpty()
  timestamp: Date;

  @IsNumber()
  @IsNotEmpty()
  consumption: number;
}
