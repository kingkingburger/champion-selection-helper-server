import { Test, TestingModule } from '@nestjs/testing';
import { ChampionRateService } from './champion-rate.service';

describe('ChampionRateService', () => {
  let service: ChampionRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChampionRateService],
    }).compile();

    service = module.get<ChampionRateService>(ChampionRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
