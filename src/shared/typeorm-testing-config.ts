/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import { Store} from '../store/store.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Store, Product],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([Store, Product]),
];