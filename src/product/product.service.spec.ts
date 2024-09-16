import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { BadRequestException } from '@nestjs/common';
import { TypeOrmTestingConfig } from '../shared/typeorm-testing-config';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;
  let productsList: Product[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: Product = await repository.save({
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
      });
      productsList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: Product[] = await service.findAll();
    expect(products).toHaveLength(productsList.length);
    expect(products).toEqual(expect.arrayContaining(productsList));
  });


  it('findOne should return a product by id', async () => {
    const storedProduct: Product = productsList[0];
    const product: Product = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.name).toEqual(storedProduct.name);
    expect(product.price).toEqual(storedProduct.price);
    expect(product.type).toEqual(storedProduct.type);
  });

  it('create should throw BadRequestException for invalid type', async () => {
    const invalidProduct = {
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      type: 'InvalidType',
    }
    await expect(service.create(invalidProduct)).rejects.toThrow(BadRequestException);
  });


  it('create should create and return a new product', async () => {
    const newProduct: CreateProductDto = {
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
    };

    const product: Product = await service.create(newProduct);
    expect(product.name).toEqual(newProduct.name);
    expect(product.price).toEqual(newProduct.price);
    expect(product.type).toEqual(newProduct.type);
  });

  it('delete should delete the product', async () => {
    const storedProduct: Product = productsList[0];
    await service.delete(storedProduct.id);
    const product = await repository.findOne({ where: { id: storedProduct.id } });
    expect(product).toBeNull();
  });


});
