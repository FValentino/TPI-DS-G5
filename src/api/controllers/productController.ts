import type { Request, Response } from "express";
import { productService } from '../../core/services/productServices.js'

export const productController = {
  //GET /productos
  getAllProducts: async (req: Request, res: Response)=>{
    try{
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const products = await productService.getAll(page, limit);
      res.status(200).json(products);
    } catch{
      res.status(500).json({ message: 'Error al obtener los productos.'})
    }
  },

  // GET /productos/:productoId
  getProductById: async (req: Request, res: Response) =>{
    try{
      const id = parseInt(req.params.productoId);
      const product = await productService.getById(id);
      if(!product){
        return res.status(404).json({message:'Producto no encontrado.'});
      }
      res.status(200).json(product);
    }catch(error){
      res.status(500).json({message:'Error al obtener el producto.'});
    }
  },

  // POST /productos
  createProduct: async (req: Request, res: Response) => {
    try {
      const newProduct = await productService.create(req.body);
      res.status(201).json({ id: newProduct.id, mensaje: 'Producto creado exitosamente.' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error al crear el producto.' });
    }
  }, 

  // DELETE /productos/:productoId
  deleteProduct: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.productoId);
      const wasDeleted = await productService.deleteById(id);
      if (!wasDeleted) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el producto.' });
    }
  }

};