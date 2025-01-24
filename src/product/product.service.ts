import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const { name, price, description, stock, category } = createProductDto;

    const createdProduct = await this.prisma.product.create({
      data: {
        name,
        price,
        description,
        stock,
        category,
      },
    });

    // return the product
    return {
      id: createdProduct.id,
      name: createdProduct.name,
      description: createdProduct.description,
      price: createdProduct.price,
      createdAt: createdProduct.createdAt.toISOString(),
    };
  }

  async getProducts(skip: number = 0, take: number = 10) {
    return this.prisma.product.findMany({ skip, take });
  }
}
