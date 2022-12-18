import { ChampionRate } from 'src/champion-rate/entities/champion-rate.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Champion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  champNumber: number;
  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date | null;
  @OneToOne((type) => ChampionRate, (championRate) => championRate.name)
  @JoinColumn()
  championRateName: string; // championRate에 대한 테이블 fk
}
