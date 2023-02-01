import { ChampionRate } from "src/champion-rate/entities/champion-rate.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity
} from "typeorm";

@Entity()
export class Champion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: number; // 챔피언 고유의 id

  @Column({ unique: true })
  name: string;

  @Column()
  engName: string;

  @Column({ default: "" })
  line: string;

  @Column()
  img: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date | null;
  @OneToOne((type) => ChampionRate, (championRate) => championRate.name)
  @JoinColumn()
  championRateName: number; // championRate에 대한 테이블 fk
}

export interface versionInfoData {
  versionId: number;
  description: string;
  patchDate: string;
  isActive: true;
  createdAt: string;
  updatedAt: string;
}

export interface champSummaryData {
  id: string;
  buildTypeId: number;
  winRate: string;
  pickRate: string;
  banRate: string;
  lastPsScore: string;
  psScore: string;
  lastRanking: number;
  ranking: number;
  top1LaneId: number;
  top1LaneRatio: string;
  top2LaneId: number;
  top2LaneRatio: string;
  top3LaneId: number;
  top3LaneRatio: string;
  counterChampionIdList: Array<number>;
  counterWinrateList: Array<number>;
  counterCountList: Array<number>;
  counterEasyChampionIdList: Array<number>;
  counterEasyWinrateList: Array<number>;
  counterEasyCountList: Array<number>;
  mainRuneCategory: number;
  subRuneCategory: number;
  mainRune1: number;
  mainRune2: number;
  mainRune3: number;
  mainRune4: number;
  subRune1: number;
  subRune2: number;
  statperk1Id: number;
  statperk2Id: number;
  statperk3Id: number;
  spell1Id: number;
  spell2Id: number;
  skillMasterList: Array<number>;
  startingItemIdList: Array<number>;
  coreItemIdList: Array<number>;
  skillLv15List: Array<string>;
  shoesId: number;
  item_1coreList: Array<number>;
  item_2coreList: Array<number>;
  item_3coreList: Array<number>;
  item_4coreList: Array<number>;
  item_5coreList: Array<number>;
  createdAt: string;
  updatedAt: string;
  buildWinRate: null;
  buildPickRate: null;
  count: number;
  buildCount: null;
  psTier: number;
  runeTotalWinrate: string;
  runeTotalPickrate: string;
  runeTotalCount: number;
  skillMasterWinrate: string;
  skillMasterPickrate: string;
  skillMasterCount: number;
  startingWinrate: string;
  startingPickrate: string;
  startingCount: number;
  top1ThreeCoreIdList: Array<number>;
  top1ThreeCorePickrate: string;
  top1ThreeCoreWinrate: string;
  top1ThreeCoreCount: number;
  top2ThreeCoreIdList: Array<number>;
  top2ThreeCorePickrate: string;
  top2ThreeCoreWinrate: string;
  top2ThreeCoreCount: number;
  top3ThreeCoreIdList: Array<number>;
  top3ThreeCorePickrate: string;
  top3ThreeCoreWinrate: string;
  top3ThreeCoreCount: number;
  top4LaneId: number;
  top4LaneRatio: string;
  top5LaneId: number;
  top5LaneRatio: string;
  championId: number;
  laneId: number;
  regionId: number;
  tierId: number;
  versionId: number;
  top3_1stCoreIdList: Array<number>;
  top3_2ndCoreIdList: Array<number>;
  top3_3rdCoreIdList: Array<number>;
  top3_1stCoreWinrateList: Array<number>;
  top3_2ndCoreWinrateList: Array<number>;
  top3_3rdCoreWinrateList: Array<number>;
  top3_1stCorePickrateList: Array<number>;
  top3_2ndCorePickrateList: Array<number>;
  top3_3rdCorePickrateList: Array<number>;
  top3_1stCoreCountList: Array<number>;
  top3_2ndCoreCountList: Array<number>;
  top3_3rdCoreCountList: Array<number>;
  isOp: false;
  isHoney: false;
}

export interface scriptContentObjectInData {
  versionInfo: Array<versionInfoData>;
  championArguments: {
    regionId: number;
    tierId: number;
    championId: number;
    versionId: number;
    laneId: number;
  };
  champSummary: Array<champSummaryData>;
}
