import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { asyncHandler } from '../middleware/errorHandler';

export class ProductController {
  static createProduct = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const product = await ProductService.createProduct(data);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  });

  static getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;

    const result = await ProductService.getAllProducts(page, limit, search, category);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result.products,
      pagination: result.pagination
    });
  });

  static getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await ProductService.getProductById(id);

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  });

  static updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const product = await ProductService.updateProduct(id, data);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  });

  static deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });

  static getLowStockProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductService.getLowStockProducts();

    res.status(200).json({
      success: true,
      message: 'Low stock products retrieved successfully',
      data: products
    });
  });
}
