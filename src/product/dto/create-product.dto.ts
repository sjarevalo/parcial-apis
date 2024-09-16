import { IsString, IsDecimal, IsIn } from 'class-validator';

export class CreateProductDto {
  @IsString()
    name!: string;

  @IsDecimal()
    price!: number;

  @IsIn(['Perecedero', 'No perecedero'])
    type!: string;
}
