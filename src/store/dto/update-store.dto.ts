import { IsString, Length, IsOptional } from 'class-validator';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'City code must be exactly 3 characters' })
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
