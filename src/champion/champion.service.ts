import { CreateChampionRateDto } from "./../champion-rate/dto/create-champion-rate.dto";
import { CreateChampionDto } from "./dto/create-champion.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import * as cheerio from "cheerio";
import { Not, Repository } from "typeorm";

import { dataInChampion, UpdateChampionDto } from "./dto/update-champion.dto";
import { Champion, champSummaryData, scriptContentObjectInData } from "./entities/champion.entity";
import { ChampionRate } from "../champion-rate/entities/champion-rate.entity";

@Injectable()
export class ChampionService {
  constructor(
    @InjectRepository(Champion)
    private readonly championRepository: Repository<Champion>,
    @InjectRepository(ChampionRate)
    private readonly championRateRepository: Repository<ChampionRate>
  ) {}

  // [riot 최신 version을 가져오기] 위한 api 호출
  getRiotVersion = async () => {
    try {
      const result = await axios.get(`https://ddragon.leagueoflegends.com/api/versions.json`);
      return result.data[0];
    } catch (err) {
      return new Promise((resolve, reject) => {
        return reject(err);
      });
    }
  };

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
      const lineArray = ["top", "jug", "mid", "ad", "sup"];
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

        // [챔피언 key 사이의 간극을 줄이기 위한] 챔피언의 key별로 for문 순회
        for (const championOwnKey in findAllChampionDB) {
          const key = findAllChampionDB[championOwnKey].key;
          const html = await getHtml(key);

          // 2. 챔피언별 어려운상대, 쉬운상대 3개 뽑기
          const $ = cheerio.load(html);
          const scriptContents = $("script")
            .map((i, el) => $(el).html())
            .get();

          // 크롤링 데이터를 가공
          const scriptContentObject = JSON.parse(scriptContents[5]);
          const scriptContentObjectInData = scriptContentObject[3] as Record<string, any>;
          const scriptCoreDataObject: scriptContentObjectInData = scriptContentObjectInData.data;

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
          await this.championRepository.update(originalDbDataByName[championRateInsertParam.name], {
            championRateName: rateTableResult.raw[0].id,
            line: lineArray[ChampionSummaryObject.top1LaneId]
          });
        }
      } catch (err) {
        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    };

    await insertChampion();
    return "크롤링 데이터 입력 성공";
  }

  // riot api를 이용해서 챔피언 이름, 영어이름, 고유 키 db에 저장하기 위함
  async initRiotApi() {
    try {
      // riot api 가져오기
      const getRiotApi = async () => {
        try {
          const version = await this.getRiotVersion();
          const result = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`);
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
            engName: championName,
            img: `http://ddragon.leagueoflegends.com/cdn/${riotApiChampionResponse.version}/img/champion/${riotApiChampionResponse.image.full}`
          };
          await this.championRepository.upsert(insertedChampionParam, ["name"]);
        }
      };
      // 라이엇 api를 이용해서 db에 값을 저장하기
      await useriotApiInsertChampionInfo();
      return `라이엇 api 입력 성공`;
    } catch (err) {
      return new Promise((rejects) => {
        return rejects(err);
      });
    }
  }

  findAll() {
    return this.championRepository.find({ relations: ["championRateName"] });
  }

  // [riot 최신 version을 가져오기] 위한 api 호출
  getVersion() {
    return this.getRiotVersion();
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

  // 배열의 랜덤한 element를 반환
  getRandomElement<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // 4개의 챔피언 추천(라인별)
  async findOtherLine(line: string) {
    const result: Array<Champion> = [];
    const fourOtherLine = await Champion.findBy({ line: Not(line) });

    const fourLineArray = ["top", "jug", "mid", "ad", "sup"].filter((value) => value !== line);

    const championArray1: Array<Champion> = [];
    const championArray2: Array<Champion> = [];
    const championArray3: Array<Champion> = [];
    const championArray4: Array<Champion> = [];

    const allChampionArray = [championArray1, championArray2, championArray3, championArray4];

    for (const champion of fourOtherLine) {
      if (champion.line === fourLineArray[0]) allChampionArray[0].push(champion);
      if (champion.line === fourLineArray[1]) allChampionArray[1].push(champion);
      if (champion.line === fourLineArray[2]) allChampionArray[2].push(champion);
      if (champion.line === fourLineArray[3]) allChampionArray[3].push(champion);
    }

    for (let i = 0; i < 4; i++) {
      result.push(this.getRandomElement(allChampionArray[i]));
    }
    return result;
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
