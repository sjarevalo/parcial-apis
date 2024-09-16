import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { StoreService } from './store.service';
import { Store } from './store.entity';
import { Product } from '../product/product.entity'; 
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TypeOrmTestingConfig } from '../shared/typeorm-testing-config';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<Store>;
  let storesList: Store[] = [];
  let productsList: Product[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<Store>>(getRepositoryToken(Store));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    storesList = [];
    productsList = [];

    for (let i = 0; i < 5; i++) {
      const store: Store = await repository.save({
        name: faker.company.name(),
        city: faker.string.alpha({ length: 3 }),
        address: faker.location.streetAddress(),
        products: [],
      });
      storesList.push(store);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return an array of stores', async () => {
    const stores: Store[] = await service.findAll();
    expect(stores).toHaveLength(storesList.length);
  });

  it('findOne should return a store by id', async () => {
    const storedStore: Store = storesList[0];
    const store: Store = await service.findOne(storedStore.id);
    expect(store).not.toBeNull();
    expect(store.name).toEqual(storedStore.name);
    expect(store.city).toEqual(storedStore.city);
    expect(store.address).toEqual(storedStore.address);
    expect(store.products).toEqual(expect.arrayContaining(storedStore.products));
  });

  it('create should throw BadRequestException for invalid city', async () => {
    const invalidStore = {
      name: faker.company.name(),
      city: 'InvalidCity',
      address: faker.location.streetAddress(),
      products: [],
    };

    await expect(service.create(invalidStore)).rejects.toThrow(BadRequestException);
  });

  it('update should update a store by id', async () => {
    const storedStore: Store = storesList[0];
    const updatedStore = {
      name: 'Updated Name',
      city: 'BCN',
      address: 'Updated Address',
      products: [],
    };

    const store: Store = await service.update(storedStore.id, updatedStore);
    expect(store).not.toBeNull();
    expect(store.name).toEqual(updatedStore.name);
    expect(store.city).toEqual(updatedStore.city);
    expect(store.address).toEqual(updatedStore.address);
    expect(store.products).toEqual(expect.arrayContaining(updatedStore.products));
  });

  it('delete should remove a store by id', async () => {
    const storedStore: Store = storesList[0];
    await service.delete(storedStore.id);
    const store = await repository.findOne({ where: {id: storedStore.id  } });
    expect(store).toBeNull;
  });
});
