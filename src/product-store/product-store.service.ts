import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { Store } from '../store/store.entity';

@Injectable()
export class ProductStoreService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async addStoreToProduct(productId: number, storeId: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['stores'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    if (product.stores.some(s => s.id === storeId)) {
      throw new BadRequestException(`Store with ID ${storeId} is already associated with Product ${productId}`);
    }

    product.stores.push(store);
    return this.productRepository.save(product);
  }

  async findStoresFromProduct(productId: number): Promise<Store[]> {
    const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['stores'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return product.stores;
  }

  async findStoreFromProduct(productId: number, storeId: number): Promise<Store> {
    const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['stores'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const store = product.stores.find(s => s.id === storeId);
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} is not associated with Product ${productId}`);
    }
    return store;
  }

  async updateStoresFromProduct(productId: number, storeIds: number[]): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['stores'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const stores = await this.storeRepository.findByIds(storeIds);
    if (stores.length !== storeIds.length) {
      throw new NotFoundException('One or more stores not found');
    }

    product.stores = stores;
    return this.productRepository.save(product);
  }

  async deleteStoreFromProduct(productId: number, storeId: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['stores'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const storeIndex = product.stores.findIndex(s => s.id === storeId);
    if (storeIndex === -1) {
      throw new NotFoundException(`Store with ID ${storeId} is not associated with Product ${productId}`);
    }

    product.stores.splice(storeIndex, 1);
    return this.productRepository.save(product);
  }
}
