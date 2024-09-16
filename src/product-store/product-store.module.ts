import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import { Store } from '../store/store.entity';
import { ProductStoreService } from '../product-store/product-store.service';
import { ProductStoreController } from './product-store.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Store]),
  ],
  providers: [ProductStoreService],
  controllers: [ProductStoreController],
})
export class AppModule {}
