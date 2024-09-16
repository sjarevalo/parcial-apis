import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<Store[]> {
    return this.storeRepository.find();
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    // Validación de ciudad
    const { city } = createStoreDto;
    if (!this.isValidCityCode(city)) {
      throw new BadRequestException('City code must be exactly 3 characters');
    }

    const store = this.storeRepository.create(createStoreDto);
    return this.storeRepository.save(store);
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    // Validación de ciudad si está presente en el DTO
    if (updateStoreDto.city && !this.isValidCityCode(updateStoreDto.city)) {
      throw new BadRequestException('City code must be exactly 3 characters');
    }

    const store = await this.storeRepository.preload({
      id,
      ...updateStoreDto,
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return this.storeRepository.save(store);
  }

  async delete(id: number): Promise<void> {
    const result = await this.storeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
  }

  private isValidCityCode(city: string): boolean {
    return /^[A-Z]{3}$/.test(city);
  }
}
