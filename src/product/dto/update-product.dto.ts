import { IsString, IsDecimal, IsIn, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDecimal()
  price?: number;

  @IsOptional()
  @IsIn(['Perecedero', 'No perecedero'])
  type?: string;
}
