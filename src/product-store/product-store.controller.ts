import { Controller, Post, Get, Param, Body, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductStoreService } from '../product-store/product-store.service';

@Controller('products')
export class ProductStoreController {
  constructor(
    private readonly productStoreAssociationService: ProductStoreService,
  ) {}

  @Post(':productId/stores/:storeId')
  async addStoreToProduct(
    @Param('productId') productId: number,
    @Param('storeId') storeId: number,
  ) {
    try {
      return await this.productStoreAssociationService.addStoreToProduct(productId, storeId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  @Get(':productId/stores')
  async findStoresFromProduct(
    @Param('productId') productId: number,
  ) {
    try {
      return await this.productStoreAssociationService.findStoresFromProduct(productId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  @Get(':productId/stores/:storeId')
  async findStoreFromProduct(
    @Param('productId') productId: number,
    @Param('storeId') storeId: number,
  ) {
    try {
      return await this.productStoreAssociationService.findStoreFromProduct(productId, storeId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  @Post(':productId/stores')
  async updateStoresFromProduct(
    @Param('productId') productId: number,
    @Body() storeIds: number[],
  ) {
    try {
      return await this.productStoreAssociationService.updateStoresFromProduct(productId, storeIds);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  @Delete(':productId/stores/:storeId')
  async deleteStoreFromProduct(
    @Param('productId') productId: number,
    @Param('storeId') storeId: number,
  ) {
    try {
      return await this.productStoreAssociationService.deleteStoreFromProduct(productId, storeId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }
}
