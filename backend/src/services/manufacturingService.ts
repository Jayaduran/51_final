// ...existing code...
import prisma from '../config/database';
import { CreateManufacturingOrderRequest, UpdateManufacturingOrderRequest } from '../types';
import { createError } from '../middleware/errorHandler';

export class ManufacturingService {
  // Dashboard KPIs: total orders, pending orders, stock levels, production efficiency
  static async getDashboardKPIs() {
    // Total manufacturing orders
    const totalOrders = await prisma.manufacturingOrder.count();
    // Pending orders (Draft, Confirmed, Planned, In Progress)
    const pendingOrders = await prisma.manufacturingOrder.count({
      where: {
        status: { in: ['DRAFT', 'CONFIRMED', 'PLANNED', 'IN_PROGRESS'] }
      }
    });
    // Stock levels (sum of all currentStock in StockItem)
    const stockAgg = await prisma.stockItem.aggregate({
      _sum: { currentStock: true }
    });
    const stockLevels = stockAgg._sum.currentStock || 0;
    // Production efficiency: percent of completed orders out of all except canceled
    const completed = await prisma.manufacturingOrder.count({ where: { status: 'DONE' } });
    const notCanceled = await prisma.manufacturingOrder.count({ where: { status: { not: 'CANCELED' } } });
    const productionEfficiency = notCanceled > 0 ? Math.round((completed / notCanceled) * 100) : 0;
    return {
      totalOrders,
      pendingOrders,
      stockLevels,
      productionEfficiency
    };
  }
  // List orders with filters for Auto-Generated Orders tab
  static async getOrdersWithFilters(filters: any, skip = 0, take = 10) {
    return prisma.manufacturingOrder.findMany({
      where: filters,
      skip,
      take,
      orderBy: { createdDate: 'desc' },
      include: { product: true, workOrders: true }
    });
  }

  static async countOrdersWithFilters(filters: any) {
    return prisma.manufacturingOrder.count({ where: filters });
  }
  static async createOrder(data: CreateManufacturingOrderRequest) {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: data.productId }
    });

    if (!product) {
      throw createError('Product not found', 404);
    }

    // Generate order number in format MO-YYYYMMDD-####
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;

    // Find the latest order for today
    const lastOrder = await prisma.manufacturingOrder.findFirst({
      where: {
        orderNumber: {
          startsWith: `MO-${dateStr}`
        }
      },
      orderBy: { createdDate: 'desc' }
    });

    let counter = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const match = lastOrder.orderNumber.match(/MO-\d{8}-(\d{4})$/);
      if (match) {
        counter = parseInt(match[1], 10) + 1;
      }
    }
    const orderNumber = `MO-${dateStr}-${String(counter).padStart(4, '0')}`;

    const order = await prisma.manufacturingOrder.create({
      data: {
        orderNumber,
        item: data.item,
        productId: data.productId,
        quantity: data.quantity,
        deadline: new Date(data.deadline),
        assignee: data.assignee,
        notes: data.notes,
        status: 'DRAFT',
        progress: 0
      },
      include: {
        product: true,
        workOrders: true
      }
    });

    return order;
  }

  static async getAllOrders(page: number = 1, limit: number = 10, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { item: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.manufacturingOrder.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: true,
          workOrders: true
        },
  orderBy: { createdDate: 'desc' }
      }),
      prisma.manufacturingOrder.count({ where })
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getOrderById(id: string) {
    const order = await prisma.manufacturingOrder.findUnique({
      where: { id },
      include: {
        product: true,
        workOrders: true
      }
    });

    if (!order) {
      throw createError('Manufacturing order not found', 404);
    }

    return order;
  }

  static async updateOrder(id: string, data: UpdateManufacturingOrderRequest) {
    const order = await prisma.manufacturingOrder.findUnique({
      where: { id }
    });

    if (!order) {
      throw createError('Manufacturing order not found', 404);
    }

    const updateData: any = { ...data };
    
    if (data.deadline) {
      updateData.deadline = new Date(data.deadline);
    }

    const updatedOrder = await prisma.manufacturingOrder.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
        workOrders: true
      }
    });

    return updatedOrder;
  }

  static async deleteOrder(id: string) {
    const order = await prisma.manufacturingOrder.findUnique({
      where: { id }
    });

    if (!order) {
      throw createError('Manufacturing order not found', 404);
    }

    await prisma.manufacturingOrder.delete({
      where: { id }
    });

    return { message: 'Manufacturing order deleted successfully' };
  }

  static async getOrderStats() {
    const [total, planned, inProgress, done, canceled] = await Promise.all([
      prisma.manufacturingOrder.count(),
      prisma.manufacturingOrder.count({ where: { status: 'PLANNED' } }),
      prisma.manufacturingOrder.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.manufacturingOrder.count({ where: { status: 'DONE' } }),
      prisma.manufacturingOrder.count({ where: { status: 'CANCELED' } })
    ]);

    return {
      total,
      planned,
      inProgress,
      done,
      canceled
    };
  }
}
