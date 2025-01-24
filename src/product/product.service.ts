import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const { name, price, description, stock_quantity, category } =
      createProductDto;

    const createdProduct = await this.prisma.product.create({
      data: {
        name,
        price,
        description,
        stock_quantity,
        category,
      },
    });

    // return the product
    return {
      id: createdProduct.id,
      name: createdProduct.name,
      description: createdProduct.description,
      stock_quantity: createdProduct.stock_quantity,
      price: createdProduct.price,
      createdAt: createdProduct.createdAt.toISOString(),
    };
  }

  // Get all products with pagination
  async getProducts(skip: number = 0, take: number = 10) {
    return this.prisma.product.findMany({ skip, take });
  }

  // Search products by name (case-insensitive, partial match)
  async searchProducts(name: string) {
    return this.prisma.product.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }

  // Filter products by category and price range
  async filterProducts(category: string, minPrice: number, maxPrice: number) {
    return this.prisma.product.findMany({
      where: {
        category,
        price: { gte: minPrice, lte: maxPrice },
      },
    });
  }

  // Sort products by a field (e.g., price, name)
  async getProductsSorted(sortBy: string, order: 'asc' | 'desc') {
    return this.prisma.product.findMany({
      orderBy: { [sortBy]: order },
    });
  }

  // Update an existing product
  async updateProduct(updateProductDto: UpdateProductDto) {
    const { id, ...updateData } = updateProductDto;

    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  // Delete a product by ID
  async deleteProduct(data: { id: number }) {
    const { id } = data;

    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: `Product with ID ${id} deleted successfully` };
  }
}
