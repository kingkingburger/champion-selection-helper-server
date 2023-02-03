import { Test, TestingModule } from "@nestjs/testing";
import { ChampionService } from "./champion.service";
import { Champion } from "./entities/champion.entity";
import { ChampionRate } from "../champion-rate/entities/champion-rate.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ChampionRateService } from "../champion-rate/champion-rate.service";
import { ChampionRepository } from "./repository/champion.repository";
import { ChampionRateRepository } from "../champion-rate/repository/champion-rate.repository";
import { Not, Repository, DataSource } from "typeorm";
import { Inject } from "@nestjs/common";
import { databaseProviders } from "../config/database.providers";

const dataSourceObject = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3308,
  username: "root",
  password: "1234",
  database: "dev",
  entities: [Champion, ChampionRate],
  synchronize: true
});
class MockChampionRepository {
  championRepository = dataSourceObject.getRepository(Champion);
  findAll() {
    return this.championRepository.find();
  }
  findOne() {}
}
class MockChampioRatenRepository {}
describe("ChampionService", () => {
  let service: ChampionService;
  // let championRepository: Repository<Champion>;
  // let championRateRepository: Repository<ChampionRate>;
  // let dataSource: DataSource = dataSourceObject; /* 추가된 코드 */
  const CHMAPION_REPOSITORY_TOKEN = getRepositoryToken(Champion);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChampionService,
        { provide: getRepositoryToken(Champion, dataSourceObject), useClass: MockChampionRepository },
        { provide: getRepositoryToken(ChampionRate, dataSourceObject), useClass: MockChampioRatenRepository }
      ]
    }).compile();

    service = module.get<ChampionService>(ChampionService);
    // championRepository = module.get<Repository<Champion>>(CHMAPION_REPOSITORY_TOKEN);
    // dataSource = module.get<DataSource>(DataSource); /* 추가된 코드 */
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // it("챔피언4개를 뽑아준다", () => {
  //   expect(service.findOtherLine("jug"));
  // });

  it("repository 사용하기", async () => {
    console.log(getRepositoryToken(Champion, dataSourceObject).toString);

    // console.log(service.findOne());
  });

  it("find", () => {
    // await championRepository.find();
  });
});
