import { Test, TestingModule } from "@nestjs/testing";
import { ChampionService } from "./champion.service";
import { Champion } from "./entities/champion.entity";
import { ChampionRate } from "../champion-rate/entities/champion-rate.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ChampionRateService } from "../champion-rate/champion-rate.service";
import { ChampionRepository } from "./repository/champion.repository";
import { ChampionRateRepository } from "../champion-rate/repository/champion-rate.repository";

describe("ChampionService", () => {
  let service: ChampionService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ChampionService,
        { provide: getRepositoryToken(Champion), useClass: Champion },
        { provide: getRepositoryToken(ChampionRate), useClass: ChampionRate }
      ]
    }).compile();

    service = app.get<ChampionService>(ChampionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("챔피언4개를 뽑아준다", () => {
    expect(service.findOtherLine("jug"));
  });
});
