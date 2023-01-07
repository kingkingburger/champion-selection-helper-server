import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ChampionRate } from 'src/champion-rate/entities/champion-rate.entity';
import { Repository } from 'typeorm';

import { CreateChampionRateDto } from './../champion-rate/dto/create-champion-rate.dto';
import { CreateChampionDto } from './dto/create-champion.dto';
import { UpdateChampionDto, dataInChampion } from './dto/update-champion.dto';
import { Champion } from './entities/champion.entity';

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
  async updateEngChampionName(updateChampionDto: UpdateChampionDto) {
    const findAllChampionDB = await this.championRepository.find();

    // 챔피언이름 : id로 딕셔너리 만들기
    let originalDbData = [];
    for (let champ in findAllChampionDB) {
      const dbChampInfo = findAllChampionDB[champ];
      originalDbData[dbChampInfo.name] = dbChampInfo.id;
    }

    // 1. fetch로 roit api 호출하기
    const riotApiResponse = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${updateChampionDto.version}/data/ko_KR/champion.json`,
    );

    let riotApiDataResult = [];
    // 2. api 호출이 성공했을 때
    if (riotApiResponse.ok) {
      const data = (await riotApiResponse.json()) as Record<
        string,
        dataInChampion
      >;
      const fromRiotApiData = data.data;

      // 챔피언이름 : engName 로 딕셔너리 만들기
      for (let champ in fromRiotApiData) {
        const champInfo: dataInChampion = fromRiotApiData[champ];
        riotApiDataResult[champInfo.name] = champInfo.id;
      }

      for (let champ in originalDbData) {
        await this.championRepository.update(
          // db에 넣을 챔피언 이름, 가져온 name를 기준
          { id: originalDbData[champ] },
          // db에 넣을 engName들
          { engName: riotApiDataResult[champ] },
        );
      }
      return fromRiotApiData;
    }
  }
}
