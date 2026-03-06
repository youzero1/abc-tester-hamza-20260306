import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('calculations')
export class Calculation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 500 })
  expression!: string;

  @Column({ type: 'varchar', length: 100 })
  result!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
