import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { StoreService } from './store.service'
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Store> {
    return this.storeService.findOne(id);
  }

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeService.create(createStoreDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.storeService.delete(id);
  }
}
