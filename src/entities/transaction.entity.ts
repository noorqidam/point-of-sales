import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { TransactionDetail } from "./transactionDetail.entity";

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  transactionType!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  transactionDate!: Date;

  @OneToMany(() => TransactionDetail, (detail) => detail.transaction)
  details!: TransactionDetail[];
}
