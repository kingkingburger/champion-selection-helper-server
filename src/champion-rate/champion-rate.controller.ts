import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChampionRateService } from './champion-rate.service';
import { CreateChampionRateDto } from './dto/create-champion-rate.dto';
import { UpdateChampionRateDto } from './dto/update-champion-rate.dto';

@Controller('champion-rate')
export class ChampionRateController {
  constructor(private readonly championRateService: ChampionRateService) {}

  @Post()
  create(@Body() createChampionRateDto: CreateChampionRateDto) {
    return this.championRateService.create(createChampionRateDto);
  }

  @Get()
  findAll() {
    return this.championRateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.championRateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChampionRateDto: UpdateChampionRateDto) {
    return this.championRateService.update(+id, updateChampionRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.championRateService.remove(+id);
  }
}
