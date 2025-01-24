import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock_quantity?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
