import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChampionService } from './champion.service';
import { CreateChampionDto } from './dto/create-champion.dto';
import { UpdateChampionDto } from './dto/update-champion.dto';

@Controller('champion')
export class ChampionController {
  constructor(private readonly championService: ChampionService) {}

  @Post()
  create() {
    return this.championService.create();
  }

  @Get()
  findAll() {
    return this.championService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.championService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChampionDto: UpdateChampionDto,
  ) {
    return this.championService.update(+id, updateChampionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.championService.remove(+id);
  }
}
