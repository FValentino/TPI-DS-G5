import { AppDataSource } from "../../config/appDataSource.js";
import { Product } from "../entities/Product.js";
import { ProductInput } from "../types/product.js";

const productRepository = AppDataSource.getRepository(Product);

export const productService = {
  // Obtener todos los productos
  getAll: async (page: number = 1, limit: number = 10): Promise<Product[]> => {
    return await productRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  },

  // Obtener un producto por su ID
  getById: async (id: number): Promise<Product | null> => {
    return await productRepository.findOneBy({ id });
  },

  // Crear un nuevo producto
  create: async (productData: ProductInput): Promise<Product> => {
    // Validar que no exista un producto con el mismo nombre
    const existingProduct = await productRepository.findOneBy({ nombre: productData.nombre });
    if (existingProduct) {
      throw new Error('Ya existe un producto con ese nombre.');
    }

    const newProduct = productRepository.create({
      nombre: productData.nombre,
      descripcion: productData.descripcion,
      precio: productData.precio,
      stockDisponible: productData.stockInicial,
      pesoKg: productData.pesoKg,
      
    });

    return await productRepository.save(newProduct);
  },

  // Eliminar un producto por su ID
  deleteById: async (id: number): Promise<boolean> => {
    const deleteResult = await productRepository.delete(id);
    
    if (deleteResult.affected === 0) {
      return false;
    }
    return true;
  }
};