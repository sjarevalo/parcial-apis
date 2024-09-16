import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable  } from 'typeorm';
import { Store } from '../store/store.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  type: string;

  @ManyToMany(() => Store, (store) => store.products)
  @JoinTable()
  stores: Store[];

  constructor(id: number, name: string, price: number, type: string) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.type = type;
  }
}
