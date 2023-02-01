import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChampionRate } from "../entities/champion-rate.entity";

@Injectable()
export class ChampionRateRepository {
  constructor(
    @InjectRepository(ChampionRate)
    private readonly championRateRepository: Repository<ChampionRate>
  ) {}
}
