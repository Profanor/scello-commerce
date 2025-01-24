import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('product')
@UseGuards(ThrottlerGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.getProducts();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productService.findOne(+id);
  // }

  // Search products by name (case-insensitive, partial match)
  @Get('search')
  search(@Query('name') name: string) {
    return this.productService.searchProducts(name);
  }

  // Filter products by category and price range
  @Get('filter')
  filter(
    @Query('category') category: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ) {
    return this.productService.filterProducts(category, minPrice, maxPrice);
  }

  // Sort products by a field (e.g., price, name)
  @Get('sorted')
  sort(@Query('sortBy') sortBy: string, @Query('order') order: 'asc' | 'desc') {
    return this.productService.getProductsSorted(sortBy, order);
  }

  // Update an existing product
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct({ id: +id, ...updateProductDto });
  }

  // Delete a product by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.deleteProduct({ id: +id });
  }
}
