import { z } from 'zod';

export const createManufacturingOrderSchema = z.object({
  body: z.object({
    item: z.string().min(1, 'Item name is required'),
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    deadline: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid deadline date'),
    assignee: z.string().optional(),
    notes: z.string().optional()
  })
});

export const updateManufacturingOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required')
  }),
  body: z.object({
    item: z.string().optional(),
    productId: z.string().optional(),
    quantity: z.number().int().positive().optional(),
    status: z.enum(['DRAFT', 'CONFIRMED', 'PLANNED', 'IN_PROGRESS', 'DONE', 'CANCELED']).optional(),
    deadline: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid deadline date').optional(),
    progress: z.number().int().min(0).max(100).optional(),
    assignee: z.string().optional(),
    notes: z.string().optional()
  })
});

export const manufacturingOrderQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    search: z.string().optional(),
    status: z.string().optional()
  })
});
