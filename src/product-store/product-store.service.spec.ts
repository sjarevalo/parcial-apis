import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { ProductStoreService } from './product-store.service';
import { Product } from '../product/product.entity';
import { Store } from '../store/store.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TypeOrmTestingConfig } from '../shared/typeorm-testing-config';

describe('ProductStoreService', () => {
  let service: ProductStoreService;
  let productRepository: Repository<Product>;
  let storeRepository: Repository<Store>;
  let productsList: Product[] = [];
  let storesList: Store[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        ProductStoreService
      ],
    }).compile();

    service = module.get<ProductStoreService>(ProductStoreService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    storeRepository = module.get<Repository<Store>>(getRepositoryToken(Store));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await productRepository.clear();
    await storeRepository.clear();
    productsList = [];
    storesList = [];

    for (let i = 0; i < 5; i++) {
      const store: Store = await storeRepository.save({
        name: faker.company.name(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
      });
      storesList.push(store);
    }

    for (let i = 0; i < 5; i++) {
      const product: Product = await productRepository.save({
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
        stores: [faker.helpers.arrayElement(storesList)],
      });
      productsList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add a store to a product', async () => {
    const product = productsList[0];
    const store = storesList[1];

    const updatedProduct = await service.addStoreToProduct(product.id, store.id);
    expect(updatedProduct.stores).toEqual(expect.arrayContaining([store]));
  });

  it('addStoreToProduct should throw NotFoundException for non-existent product', async () => {
    const invalidProductId = 9999;
    const store = storesList[0];

    await expect(service.addStoreToProduct(invalidProductId, store.id)).rejects.toThrow(NotFoundException);
  });

  it('addStoreToProduct should throw NotFoundException for non-existent store', async () => {
    const product = productsList[0];
    const invalidStoreId = 9999;

    await expect(service.addStoreToProduct(product.id, invalidStoreId)).rejects.toThrow(NotFoundException);
  });

  it('addStoreToProduct should throw BadRequestException for already associated store', async () => {
    const product = productsList[0];
    const store = product.stores[0];

    await expect(service.addStoreToProduct(product.id, store.id)).rejects.toThrow(BadRequestException);
  });

  it('findStoresFromProduct should return stores associated with a product', async () => {
    const product = productsList[0];
    const stores = await service.findStoresFromProduct(product.id);
    expect(stores).toEqual(expect.arrayContaining(product.stores));
  });

  it('findStoresFromProduct should throw NotFoundException for non-existent product', async () => {
    const invalidProductId = 9999;
    await expect(service.findStoresFromProduct(invalidProductId)).rejects.toThrow(NotFoundException);
  });

  it('findStoreFromProduct should return a specific store associated with a product', async () => {
    const product = productsList[0];
    const store = product.stores[0];

    const foundStore = await service.findStoreFromProduct(product.id, store.id);
    expect(foundStore).toEqual(store);
  });

  it('findStoreFromProduct should throw NotFoundException for non-existent store', async () => {
    const product = productsList[0];
    const invalidStoreId = 9999;

    await expect(service.findStoreFromProduct(product.id, invalidStoreId)).rejects.toThrow(NotFoundException);
  });

  it('findStoreFromProduct should throw NotFoundException for non-existent product', async () => {
    const invalidProductId = 9999;
    const store = storesList[0];

    await expect(service.findStoreFromProduct(invalidProductId, store.id)).rejects.toThrow(NotFoundException);
  });

  it('updateStoresFromProduct should update the stores associated with a product', async () => {
    const product = productsList[0];
    const newStores = [storesList[1], storesList[2]];

    const updatedProduct = await service.updateStoresFromProduct(product.id, newStores.map(store => store.id));
    expect(updatedProduct.stores).toEqual(expect.arrayContaining(newStores));
  });

  it('updateStoresFromProduct should throw NotFoundException for non-existent product', async () => {
    const invalidProductId = 9999;
    const validStoreIds = storesList.slice(0, 2).map(store => store.id);

    await expect(service.updateStoresFromProduct(invalidProductId, validStoreIds)).rejects.toThrow(NotFoundException);
  });

  it('updateStoresFromProduct should throw NotFoundException for non-existent stores', async () => {
    const product = productsList[0];
    const invalidStoreIds = [9999, 10000];

    await expect(service.updateStoresFromProduct(product.id, invalidStoreIds)).rejects.toThrow(NotFoundException);
  });

  it('deleteStoreFromProduct should remove a store from a product', async () => {
    const product = productsList[0];
    const store = product.stores[0];

    const updatedProduct = await service.deleteStoreFromProduct(product.id, store.id);
    expect(updatedProduct.stores).not.toContainEqual(store);
  });

  it('deleteStoreFromProduct should throw NotFoundException for non-existent product', async () => {
    const invalidProductId = 9999;
    const store = storesList[0];

    await expect(service.deleteStoreFromProduct(invalidProductId, store.id)).rejects.toThrow(NotFoundException);
  });

  it('deleteStoreFromProduct should throw NotFoundException for non-existent store', async () => {
    const product = productsList[0];
    const invalidStoreId = 9999;

    await expect(service.deleteStoreFromProduct(product.id, invalidStoreId)).rejects.toThrow(NotFoundException);
  });
});
