import { ChampionRate } from './entities/champion-rate.entity';
import { Module } from '@nestjs/common';
import { ChampionRateService } from './champion-rate.service';
import { ChampionRateController } from './champion-rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ChampionRate])],

  controllers: [ChampionRateController],
  providers: [ChampionRateService],
})
export class ChampionRateModule {}
