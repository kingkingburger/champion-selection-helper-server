import {
  CreateChampionRateDto,
  CreateChampionRateResultDto,
} from './../champion-rate/dto/create-champion-rate.dto';
import { Injectable } from '@nestjs/common';
import { CreateChampionDto } from './dto/create-champion.dto';
import { UpdateChampionDto } from './dto/update-champion.dto';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { Champion } from './entities/champion.entity';
import { Repository, Equal } from 'typeorm';
import { ChampionRateController } from '../champion-rate/champion-rate.controller';
import { ChampionRate } from 'src/champion-rate/entities/champion-rate.entity';
import { equal } from 'assert';

@Injectable()
export class ChampionService {
  // constructor(private readonly championRepository: ChampionRepository) {}
  constructor(
    @InjectRepository(Champion)
    private readonly championRepository: Repository<Champion>,
    @InjectRepository(ChampionRate)
    private readonly championRateRepository: Repository<ChampionRate>,
  ) {}
  async create() {
    // 1. lol.ps 챔피언 별로 가지고 오기
    const getHtml = async (championNumber: number) => {
      try {
        const result = await axios.get(
          `https://lol.ps/ko/champ/${championNumber}/statistics/`,
        );
        return result.data;
      } catch (error) {}
    };

    const championList = [];
    const championRateList = [];
    const insertChampion = async () => {
      try {
        for (let i = 1; i <= 1000; i++) {
          const html = await getHtml(i);
          if (!html) continue;

          // 2. 챔피언별 어려운상대, 쉬운상대 3개 뽑기
          const $ = cheerio.load(html);
          const championName = $(
            'body > main > div.contents > section > div.summary-heading > h3',
          );
          const hardCampionNameArray: string[] = [];
          const hardCampionRateArray: string[] = [];
          const easyCampionArray: string[] = [];
          const easyCampionRateArray: string[] = [];
          for (let i = 2; i <= 4; i++) {
            const hardCampion = `body > main > div.contents > div.row.pb-2.champ-content-row > section:nth-child(3) > div > div.versus-difficult > a:nth-child(${i}) > div.champ-info`;
            hardCampionNameArray.push($(hardCampion).text().trim());
            const hardCampionRate = `body > main > div.contents > div.row.pb-2.champ-content-row > section:nth-child(3) > div > div.versus-difficult > a:nth-child(${i}) > div.champ-stat`;

            const easyCampion = `body > main > div.contents > div.row.pb-2.champ-content-row > section:nth-child(3) > div > div.versus-easy > a:nth-child(${i}) > div.champ-info`;
            easyCampionArray.push($(easyCampion).text().trim());
            const easyCampionRate = `body > main > div.contents > div.row.pb-2.champ-content-row > section:nth-child(3) > div > div.versus-easy > a:nth-child(${i}) > div.champ-stat`;

            const hardRate: string = $(hardCampionRate)
              .text()
              .split('\n')
              .join('')
              .split(' ')
              .join('')
              .trim()
              .slice(-6);
            hardCampionRateArray.push(hardRate);
            const easyRate: string = $(easyCampionRate)
              .text()
              .split('\n')
              .join('')
              .split(' ')
              .join('')
              .trim()
              .slice(-6);
            easyCampionRateArray.push(easyRate);
          }
          console.log('챔피언 : ', championName.text().trim(), '일때');
          console.log(hardCampionNameArray[0], hardCampionRateArray[0]);
          console.log(hardCampionNameArray[1], hardCampionRateArray[1]);
          console.log(hardCampionNameArray[2], hardCampionRateArray[2]);
          console.log(easyCampionArray[0], easyCampionRateArray[0]);
          console.log(easyCampionArray[1], easyCampionRateArray[1]);
          console.log(easyCampionArray[2], easyCampionRateArray[2]);
          console.log('----------------------');
          const realChampionName = championName.text().trim();
          const championObject: CreateChampionDto = {
            champNumber: i,
            name: realChampionName,
          };
          const championRateObject: CreateChampionRateDto = {
            name: realChampionName,
            worst1Name: hardCampionNameArray[0],
            worst2Name: hardCampionNameArray[1],
            worst3Name: hardCampionNameArray[2],
            worst1Rate: hardCampionRateArray[0],
            worst2Rate: hardCampionRateArray[1],
            worst3Rate: hardCampionRateArray[2],
            great1Name: easyCampionArray[0],
            great2Name: easyCampionArray[1],
            great3Name: easyCampionArray[2],
            great1Rate: easyCampionRateArray[0],
            great2Rate: easyCampionRateArray[1],
            great3Rate: easyCampionRateArray[2],
          };
          championRateList.push(championRateObject);
          championList.push(championObject);
        }
      } catch (error) {}
    };

    await insertChampion();
    const championResult = (await this.championRateRepository.save(
      championRateList,
    )) as Array<Record<string, any>>;

    // 3. db에 넣기
    for (let i = 0, length = championList.length; i < length; i++) {
      championList[i].championRateName = championResult[i].id;
      await this.championRepository.upsert(championList, ['name']);
    }
    return 'This action adds a new champion';
  }

  findAll() {
    return this.championRepository.find({ relations: ['championRateName'] });
  }

  findOne(id: number) {
    const findChampionOne = this.championRepository.findOne({
      where: { id: id },
      relations: ['championRateName'],
    });
    return findChampionOne;
  }

  findOneByName(name: string) {
    const findChampionOne = this.championRepository.find({
      where: { name: name },
      relations: ['championRateName'],
    });
    return findChampionOne;
  }

  update(id: number, updateChampionDto: UpdateChampionDto) {
    return `This action updates a #${id} champion`;
  }

  remove(id: number) {
    return `This action removes a #${id} champion`;
  }
}
