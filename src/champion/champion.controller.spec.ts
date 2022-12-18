import { Test, TestingModule } from '@nestjs/testing';
import { ChampionController } from './champion.controller';
import { ChampionService } from './champion.service';

describe('ChampionController', () => {
  let controller: ChampionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChampionController],
      providers: [ChampionService],
    }).compile();

    controller = module.get<ChampionController>(ChampionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
