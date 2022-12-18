import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateChampionRateDto } from './dto/create-champion-rate.dto';
import { UpdateChampionRateDto } from './dto/update-champion-rate.dto';
import { ChampionRate } from './entities/champion-rate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChampionRateService {
  constructor(
    @InjectRepository(ChampionRate)
    private readonly championRateRepository: Repository<ChampionRate>,
  ) {}
  async create(createChampionRateDto: CreateChampionRateDto) {
    await this.championRateRepository.save(createChampionRateDto);
  }

  findAll() {
    return `This action returns all championRate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} championRate`;
  }

  update(id: number, updateChampionRateDto: UpdateChampionRateDto) {
    return `This action updates a #${id} championRate`;
  }

  remove(id: number) {
    return `This action removes a #${id} championRate`;
  }
}
