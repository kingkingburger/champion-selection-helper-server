import { PartialType } from '@nestjs/mapped-types';
import { CreateChampionDto } from './create-champion.dto';

export class UpdateChampionDto extends PartialType(CreateChampionDto) {}
