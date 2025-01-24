import { IsString, IsNumber, Min } from 'class-validator';
export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  stock_quantity: number;

  @IsString()
  category: string;
}
