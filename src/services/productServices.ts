import { productsData } from "../data/productData.js";
import { Product } from "../models/products.js";

export class ProductService{

  private products = productsData;

  findAllProducts(): Product[] | null {

    if (this.products.length == 0) return null;

    return this.products
  }

  // Mantener solo una función - esta es más descriptiva
  findProductById(id: number): Product | null {
    const product = this.products.find((productAux) => productAux.id === id);
    
    if (!product) return null;
    
    return product;
  } // ← Faltaba esta llave

  getAllProducts(page: number = 1, limit: number = 10, search?: string, categoryId?: number): Product[] {
    let filteredProducts = this.products;

    if (search) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.categories === categoryId
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return filteredProducts.slice(startIndex, endIndex);
  }

}