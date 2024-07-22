import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductCategory } from "./productCategory.entity";
import { TransactionDetail } from "./transactionDetail.entity";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productName!: string;

  @Column({ type: "text", nullable: true })
  productDescription!: string;

  @Column({ type: "longtext", nullable: true })
  productImage!: string;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  category!: ProductCategory;

  @OneToMany(
    () => TransactionDetail,
    (transactionDetail) => transactionDetail.product
  )
  transactionDetails!: TransactionDetail[];

  @Column()
  stock!: number;
}
