import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Product } from "./product.entity";
import { Transaction } from "./transaction.entity";

@Entity()
export class TransactionDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.details)
  transaction!: Transaction;

  @ManyToOne(() => Product, (product) => product.transactionDetails)
  product!: Product;

  @Column()
  quantity!: number;
}
