import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  // Mock ProductService methods
  const mockProductService = {
    createProduct: jest.fn(),
    getProducts: jest.fn(),
    getProductsSorted: jest.fn(),
    searchProducts: jest.fn(),
    filterProducts: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  const mockPrismaService = {
    // Mock methods in PrismaService used by ProductService
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard) // override the guard e.g. for mocking purposes
      .useValue({
        canActivate: () => true, // return true here to skip rate-limiting
      })
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        price: 100,
        description: 'Product 1 Description',
        stock_quantity: 10,
        category: 'Electronics',
      };

      mockProductService.createProduct.mockResolvedValue(createProductDto);

      expect(await controller.create(createProductDto)).toEqual(
        createProductDto,
      );
    });
  });

  describe('search', () => {
    it('should return products based on name search', async () => {
      const name = 'product';
      const result = [
        { name: 'Product 1', price: 100 },
        { name: 'Product 2', price: 150 },
      ];
      mockProductService.searchProducts.mockResolvedValue(result);

      expect(await controller.search(name)).toEqual(result);
    });
  });

  describe('filter', () => {
    it('should return filtered products based on category and price', async () => {
      const category = 'Electronics';
      const minPrice = 50;
      const maxPrice = 200;
      const result = [
        { name: 'Product 1', price: 100 },
        { name: 'Product 2', price: 150 },
      ];
      mockProductService.filterProducts.mockResolvedValue(result);

      expect(await controller.filter(category, minPrice, maxPrice)).toEqual(
        result,
      );
    });
  });

  describe('sort', () => {
    it('should return sorted products', async () => {
      const sortBy = 'price';
      const order = 'asc';
      const result = [
        { name: 'Product 1', price: 50 },
        { name: 'Product 2', price: 100 },
      ];
      mockProductService.getProductsSorted.mockResolvedValue(result);

      expect(await controller.sort(sortBy, order)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = [
        { name: 'Product 1', price: 100 },
        { name: 'Product 2', price: 150 },
      ];
      mockProductService.getProducts.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const id = '1';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 120,
        description: 'Updated Description',
        stock_quantity: 15,
        category: 'Electronics',
        id: 1,
      };
      const result = { id, ...updateProductDto };
      mockProductService.updateProduct.mockResolvedValue(result);

      expect(await controller.update(id, updateProductDto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const id = '1';
      mockProductService.deleteProduct.mockResolvedValue({ id });

      expect(await controller.remove(id)).toEqual({ id });
    });
  });
});
