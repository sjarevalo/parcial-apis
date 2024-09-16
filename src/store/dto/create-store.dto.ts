import { IsString, Length } from 'class-validator';

export class CreateStoreDto {
  @IsString()
    name!: string;

  @IsString()
    @Length(3, 3, { message: 'City code must be exactly 3 characters' })
    city!: string;

  @IsString()
    address!: string;
}
