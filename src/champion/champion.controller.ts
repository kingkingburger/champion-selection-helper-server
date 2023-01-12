import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ChampionService } from "./champion.service";
import { CreateChampionDto } from "./dto/create-champion.dto";
import { UpdateChampionDto } from "./dto/update-champion.dto";

@Controller("champion")
export class ChampionController {
  constructor(private readonly championService: ChampionService) {}

  @Post()
  create() {
    return this.championService.create();
  }
  @Post("/riot")
  createWithRiot() {
    return this.championService.initRiotApi();
  }

  @Get()
  findAll() {
    return this.championService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.championService.findOne(+id);
  }

  @Get("/name/:name")
  findOneByName(@Param("name") name: string) {
    return this.championService.findOneByName(name);
  }

  @Post("/sync/eng")
  settingEngName(@Body() updateChampionDto: UpdateChampionDto) {
    return this.championService.updateEngChampionName(updateChampionDto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateChampionDto: UpdateChampionDto
  ) {
    return this.championService.update(+id, updateChampionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.championService.remove(+id);
  }
}
