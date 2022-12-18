import { Test, TestingModule } from '@nestjs/testing';
import { ChampionRateController } from './champion-rate.controller';
import { ChampionRateService } from './champion-rate.service';

describe('ChampionRateController', () => {
  let controller: ChampionRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChampionRateController],
      providers: [ChampionRateService],
    }).compile();

    controller = module.get<ChampionRateController>(ChampionRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
