import { CreateChampionDto } from "./../dto/create-champion.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Champion } from "../entities/champion.entity";

@Injectable()
export class ChampionRepository {
  constructor(
    @InjectRepository(Champion)
    private readonly championRepository: Repository<Champion>
  ) {}
}
