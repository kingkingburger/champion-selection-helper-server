import { CreateChampionRateDto } from "./../champion-rate/dto/create-champion-rate.dto";
import { CreateChampionDto } from "./dto/create-champion.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import * as cheerio from "cheerio";
import { ChampionRate } from "src/champion-rate/entities/champion-rate.entity";
import { Repository } from "typeorm";

import { dataInChampion, UpdateChampionDto } from "./dto/update-champion.dto";
import { Champion, scriptContentObjectInData, champSummaryData } from "./entities/champion.entity";

@Injectable()
export class ChampionService {
  constructor(
    @InjectRepository(Champion)
    private readonly championRepository: Repository<Champion>,
    @InjectRepository(ChampionRate)
    private readonly championRateRepository: Repository<ChampionRate>
  ) {}

  async create() {
    // 1. lol.ps 챔피언 별로 가지고 오기
    const getHtml = async (championNumber: number) => {
      try {
        const result = await axios.get(`https://lol.ps/champ/${championNumber}`, {
          headers: { "Accept-Encoding": "gzip,deflate,compress" }
        });
        return result.data;
      } catch (err) {
        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    };

    const insertChampion = async () => {
      try {
        // [db조회를 1번만 하기 위한] 챔피언이름 : id로 딕셔너리 만들기
        const findAllChampionDB = await this.championRepository.find();
        const originalDbDataByName = [];
        const originalDbDataByKey = []; // 챔피언의 key 기준
        for (const champ in findAllChampionDB) {
          const dbChampInfo = findAllChampionDB[champ];
          originalDbDataByName[dbChampInfo.name] = dbChampInfo.id;
          originalDbDataByKey[dbChampInfo.key] = dbChampInfo;
        }

        // key = 크롤링할 챔피언의 고유키
        for (const championOwnKey in findAllChampionDB) {
          const key = findAllChampionDB[championOwnKey].key;
          const html = await getHtml(key);
          if (!html) continue;

          // 2. 챔피언별 어려운상대, 쉬운상대 3개 뽑기
          const $ = cheerio.load(html);
          const scriptContents = $("script")
            .map((i, el) => $(el).html())
            .get();

          const scriptContentObject = JSON.parse(scriptContents[5]);
          const scriptContentObjectInData = scriptContentObject[3] as Record<string, any>;
          const scriptCoreDataObject: scriptContentObjectInData = scriptContentObjectInData.data;
          // 챔피언 번호가 비어있다면 다음 챔피언으로
          if (!scriptCoreDataObject.champSummary) continue;

          // 챔피언의 능력치가 모두 들어가있는 코어 객체
          const ChampionSummaryObject: champSummaryData = scriptCoreDataObject.champSummary[0];

          console.log("어려운적");
          console.log(ChampionSummaryObject.counterChampionIdList); // 어려운적 key
          console.log(ChampionSummaryObject.counterWinrateList); // 어려운적 승률
          console.log(ChampionSummaryObject.counterCountList); // 어려운적 상대 횟수
          console.log("쉬운적");
          console.log(ChampionSummaryObject.counterEasyChampionIdList); // 쉬운적 key
          console.log(ChampionSummaryObject.counterEasyWinrateList); // 쉬운적 승률
          console.log(ChampionSummaryObject.counterEasyCountList); // 쉬운적 상대 횟수

          console.log(`현재 챔피언 : ${originalDbDataByKey[key].name}`); // url에 있는 number는 json의 key와 같다 즉, i = key

          const championRateInsertParam: CreateChampionRateDto = {
            name: originalDbDataByKey[key].name,
            worst1Name: "",
            worst2Name: "",
            worst3Name: "",
            worst1Rate: "",
            worst2Rate: "",
            worst3Rate: "",
            great1Name: "",
            great2Name: "",
            great3Name: "",
            great1Rate: "",
            great2Rate: "",
            great3Rate: ""
          };

          // 상대하기 여려운, 쉬운 적 3개를 뽑아내기 위한 for문
          for (let j = 0, length = 3; j < length; j++) {
            const findDeficultChmapion = originalDbDataByKey[ChampionSummaryObject.counterChampionIdList[j]]; // 어려운 챔피언 key로 찾아옴
            const findEasyChmapion = originalDbDataByKey[ChampionSummaryObject.counterEasyChampionIdList[j]]; // 쉬운 챔피언 key로 찾아옴
            // 상대하기 어려운적 top3 param 넣기
            championRateInsertParam.worst1Name =
              j === 0 ? findDeficultChmapion.name : championRateInsertParam.worst1Name;
            championRateInsertParam.worst2Name =
              j === 1 ? findDeficultChmapion.name : championRateInsertParam.worst2Name;
            championRateInsertParam.worst3Name =
              j === 2 ? findDeficultChmapion.name : championRateInsertParam.worst3Name;

            // 상대하기 어려운적 승률 top3 param 넣기
            championRateInsertParam.worst1Rate =
              j === 0 ? ChampionSummaryObject.counterWinrateList[j].toString() : championRateInsertParam.worst1Rate;
            championRateInsertParam.worst2Rate =
              j === 1 ? ChampionSummaryObject.counterWinrateList[j].toString() : championRateInsertParam.worst2Rate;
            championRateInsertParam.worst3Rate =
              j === 2 ? ChampionSummaryObject.counterWinrateList[j].toString() : championRateInsertParam.worst3Rate;

            // 상대하기 쉬운적 승률 top3 param 넣기
            championRateInsertParam.great1Name = j === 0 ? findEasyChmapion.name : championRateInsertParam.great1Name;
            championRateInsertParam.great2Name = j === 1 ? findEasyChmapion.name : championRateInsertParam.great2Name;
            championRateInsertParam.great3Name = j === 2 ? findEasyChmapion.name : championRateInsertParam.great3Name;

            // 상대하기 쉬운적 승률 top3 param 넣기
            championRateInsertParam.great1Rate =
              j === 0 ? ChampionSummaryObject.counterEasyWinrateList[j].toString() : championRateInsertParam.great1Rate;
            championRateInsertParam.great2Rate =
              j === 1 ? ChampionSummaryObject.counterEasyWinrateList[j].toString() : championRateInsertParam.great2Rate;
            championRateInsertParam.great3Rate =
              j === 2 ? ChampionSummaryObject.counterEasyWinrateList[j].toString() : championRateInsertParam.great3Rate;
          }

          // 3. championRate 테이블에 값을 넣어주고 chapion 테이블에 pk 연관관계 처리해주기
          const rateTableResult = await this.championRateRepository.upsert(championRateInsertParam, ["name"]);
          const syncTable = await this.championRepository.update(originalDbDataByName[championRateInsertParam.name], {
            championRateName: rateTableResult.raw[0].id
          });
        }
      } catch (err) {
        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    };

    await insertChampion();
    return "This action adds a new champion";
  }

  // riot api를 이용해서 챔피언 이름, 영어이름, 고유 키 db에 저장하기 위함
  async initRiotApi() {
    // riot api 가져오기
    const getRiotApi = async () => {
      try {
        const result = await axios.get(`https://ddragon.leagueoflegends.com/cdn/13.1.1/data/ko_KR/champion.json`);
        return result.data.data;
      } catch (err) {
        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    };

    const useriotApiInsertChampionInfo = async () => {
      const riotApi = await getRiotApi();
      for (const championName in riotApi) {
        // 챔피언의 이름별로 key, name, engName 등록하기
        const riotApiChampionResponse: dataInChampion = riotApi[championName];
        const insertedChampionParam: CreateChampionDto = {
          key: Number(riotApiChampionResponse.key),
          name: riotApiChampionResponse.name,
          engName: championName
        };
        await this.championRepository.upsert(insertedChampionParam, ["name"]);
      }
    };
    // 라이엇 api를 이용해서 db에 값을 저장하기
    await useriotApiInsertChampionInfo();
  }

  findAll() {
    return this.championRepository.find({ relations: ["championRateName"] });
  }

  findOne(id: number) {
    const findChampionOne = this.championRepository.findOne({
      where: { id: id },
      relations: ["championRateName"]
    });
    return findChampionOne;
  }

  findOneByName(name: string) {
    const findChampionOne = this.championRepository.find({
      where: { name: name },
      relations: ["championRateName"]
    });
    return findChampionOne;
  }

  update(id: number, updateChampionDto: UpdateChampionDto) {
    return `This action updates a #${id} champion`;
  }

  remove(id: number) {
    return `This action removes a #${id} champion`;
  }
  //챔피언 영어 이름을 업데이트하기위함
  async updateEngChampionName(updateChampionDto: UpdateChampionDto) {
    const findAllChampionDB = await this.championRepository.find();

    // 챔피언이름 : id로 딕셔너리 만들기
    const originalDbDataByName = [];
    for (const champ in findAllChampionDB) {
      const dbChampInfo = findAllChampionDB[champ];
      originalDbDataByName[dbChampInfo.name] = dbChampInfo.id;
    }

    // 1. fetch로 roit api 호출하기
    const riotApiResponse = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${updateChampionDto.version}/data/ko_KR/champion.json`
    );

    const riotApiDataResult = [];
    // 2. api 호출이 성공했을 때
    if (riotApiResponse.ok) {
      const data = (await riotApiResponse.json()) as Record<string, dataInChampion>;
      const fromRiotApiData = data.data;

      // 챔피언이름 : engName 로 딕셔너리 만들기
      for (const champ in fromRiotApiData) {
        const champInfo: dataInChampion = fromRiotApiData[champ];
        riotApiDataResult[champInfo.name] = champInfo.id;
      }

      for (const champ in originalDbDataByName) {
        await this.championRepository.update(
          // db에 넣을 챔피언 이름, 가져온 name를 기준
          { id: originalDbDataByName[champ] },
          // db에 넣을 engName들
          { engName: riotApiDataResult[champ] }
        );
      }
      return fromRiotApiData;
    }
  }
}
