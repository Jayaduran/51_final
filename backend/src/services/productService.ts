import prisma from '../config/database';
import { CreateProductRequest, UpdateProductRequest } from '../types';
import { createError } from '../middleware/errorHandler';

export class ProductService {
  static async createProduct(data: CreateProductRequest) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        unitPrice: data.unitPrice,
        stockQuantity: data.stockQuantity || 0,
        minStockLevel: data.minStockLevel || 0
      }
    });

    // Create corresponding stock item
    await prisma.stockItem.create({
      data: {
        productName: product.name,
        productCode: `PROD-CODE-${product.id}`,
        currentStock: product.stockQuantity,
        unit: 'pcs',
        location: 'Main Warehouse'
      }
    });

    return product;
  }

  static async getAllProducts(page: number = 1, limit: number = 10, search?: string, category?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw createError('Product not found', 404);
    }

    return product;
  }

  static async updateProduct(id: string, data: UpdateProductRequest) {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw createError('Product not found', 404);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data
    });

    // Update corresponding stock item
    await prisma.stockItem.updateMany({
      where: { productCode: `PROD-CODE-${id}` },
      data: {
        productName: updatedProduct.name,
        currentStock: updatedProduct.stockQuantity
      }
    });

    return updatedProduct;
  }

  static async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw createError('Product not found', 404);
    }

    // Check if product is used in manufacturing orders
    const manufacturingOrders = await prisma.manufacturingOrder.count({
      where: { productId: id }
    });

    if (manufacturingOrders > 0) {
      throw createError('Cannot delete product that is used in manufacturing orders', 400);
    }

    await prisma.product.delete({
      where: { id }
    });

    // Delete corresponding stock item
    await prisma.stockItem.deleteMany({
      where: { productCode: `PROD-CODE-${id}` }
    });

    return { message: 'Product deleted successfully' };
  }

  static async getLowStockProducts() {
    const products = await prisma.product.findMany({
      where: {
        stockQuantity: {
          lte: prisma.product.fields.minStockLevel
        }
      },
      orderBy: { stockQuantity: 'asc' }
    });

    return products;
  }
}
