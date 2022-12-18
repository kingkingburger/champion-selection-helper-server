import { PartialType } from '@nestjs/mapped-types';
import { CreateChampionRateDto } from './create-champion-rate.dto';

export class UpdateChampionRateDto extends PartialType(CreateChampionRateDto) {}
