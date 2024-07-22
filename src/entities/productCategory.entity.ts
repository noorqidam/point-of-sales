import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  categoryName!: string;

  @Column({ type: "text", nullable: true })
  categoryDescription!: string;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];
}
