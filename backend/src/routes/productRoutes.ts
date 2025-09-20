import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Product validation schemas
const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    category: z.string().optional(),
    description: z.string().optional(),
    unitPrice: z.number().positive('Unit price must be positive'),
    stockQuantity: z.number().int().min(0).optional(),
    minStockLevel: z.number().int().min(0).optional()
  })
});

const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required')
  }),
  body: z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    unitPrice: z.number().positive().optional(),
    stockQuantity: z.number().int().min(0).optional(),
    minStockLevel: z.number().int().min(0).optional()
  })
});

const productQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    search: z.string().optional(),
    category: z.string().optional()
  })
});

// Product routes
router.post('/', 
  requireManagerOrAdmin, 
  validateRequest(createProductSchema), 
  ProductController.createProduct
);

router.get('/', 
  validateRequest(productQuerySchema), 
  ProductController.getAllProducts
);

router.get('/low-stock', ProductController.getLowStockProducts);

router.get('/:id', ProductController.getProductById);

router.put('/:id', 
  requireManagerOrAdmin, 
  validateRequest(updateProductSchema), 
  ProductController.updateProduct
);

router.delete('/:id', 
  requireManagerOrAdmin, 
  ProductController.deleteProduct
);

export default router;
