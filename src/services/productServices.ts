import { productsData } from "../data/productData.js";
import { Product } from "../models/products.js";

export class ProductService {
  private products = productsData;
  private nextId = productsData.length > 0 ? Math.max(...productsData.map(p => p.id)) + 1 : 1;

  // ===== MÉTODOS DE CONSULTA =====

  findAllProducts(): Product[] | null {
    if (this.products.length === 0) return null;
    return this.products;
  }

  findProductById(id: number): Product | null {
    const product = this.products.find((productAux) => productAux.id === id);
    if (!product) return null;
    return product;
  }

  getAllProducts(
    page: number = 1, 
    limit: number = 10, 
    search?: string, 
    categoryId?: number
  ): { products: Product[], total: number, page: number, totalPages: number } {
    let filteredProducts = [...this.products];

    // Filtrar por búsqueda (nombre o descripción)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por categoría (busca en el array de categories)
    if (categoryId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.categories.includes(categoryId)
      );
    }

    // Calcular paginación
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total,
      page,
      totalPages
    };
  }

  // ===== MÉTODOS DE CREACIÓN =====

  createProduct(productData: Omit<Product, 'id'>): Product {
    // Validar datos
    this.validateProductData(productData);

    // Verificar que no exista un producto con el mismo nombre
    const existingProduct = this.products.find(
      p => p.name.toLowerCase() === productData.name.toLowerCase()
    );

    if (existingProduct) {
      throw new Error('Ya existe un producto con ese nombre');
    }

    // Crear el producto
    const newProduct = new Product(
      this.nextId++,
      productData.name,
      productData.description,
      productData.price,
      productData.stock || 0,
      productData.peso,
      productData.images || [],
      productData.categories || []
    );

    this.products.push(newProduct);
    return newProduct;
  }

  // ===== MÉTODOS DE ACTUALIZACIÓN =====

  updateProduct(id: number, updates: Partial<Product>): Product | null {
  const productIndex = this.products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return null;
  }

  // Validar que no se actualice el ID
  if (updates.id && updates.id !== id) {
    throw new Error('No se puede modificar el ID del producto');
  }

  // Validar datos de actualización
  this.validateProductData(updates);

  // Si se actualiza el nombre, verificar que no exista otro con el mismo
  if (updates.name) {
    const existingProduct = this.products.find(
      p => p.id !== id && p.name.toLowerCase() === updates.name!.toLowerCase()
    );

    if (existingProduct) {
      throw new Error('Ya existe otro producto con ese nombre');
    }
  }

  // Actualizar propiedades del producto existente
  const product = this.products[productIndex];
  
  Object.assign(product, updates, { id }); // id siempre se mantiene

  return product;
}

  // ===== MÉTODOS DE ELIMINACIÓN =====

  deleteProduct(id: number): boolean {
    const productIndex = this.products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return false;
    }

    // Eliminar el producto del array
    this.products.splice(productIndex, 1);
    return true;
  }

  // ===== MÉTODOS DE STOCK =====

  checkStockAvailability(productId: number, quantity: number): boolean {
    const product = this.findProductById(productId);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return product.stock >= quantity;
  }

  reserveStock(productId: number, quantity: number): boolean {
    const product = this.findProductById(productId);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (product.stock < quantity) {
      throw new Error('Stock insuficiente');
    }

    product.stock -= quantity;
    return true;
  }

  releaseStock(productId: number, quantity: number): boolean {
    const product = this.findProductById(productId);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    product.stock += quantity;
    return true;
  }

  getLowStockProducts(threshold: number = 10): Product[] {
    return this.products.filter(product => product.stock <= threshold);
  }

  // ===== MÉTODOS DE CATEGORÍA =====

  getProductsByCategory(categoryId: number): Product[] {
    return this.products.filter(product => product.categories.includes(categoryId));
  }

  // Agregar categoría a un producto
  addCategoryToProduct(productId: number, categoryId: number): Product | null {
    const product = this.findProductById(productId);

    if (!product) {
      return null;
    }

    if (!product.categories.includes(categoryId)) {
      product.categories.push(categoryId);
    }

    return product;
  }

  // Remover categoría de un producto
  removeCategoryFromProduct(productId: number, categoryId: number): Product | null {
    const product = this.findProductById(productId);

    if (!product) {
      return null;
    }

    const index = product.categories.indexOf(categoryId);
    if (index > -1) {
      product.categories.splice(index, 1);
    }

    return product;
  }

  // ===== MÉTODOS DE VALIDACIÓN =====

  private validateProductData(data: Partial<Product>): void {
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('El nombre del producto es requerido');
      }
      if (data.name.length > 100) {
        throw new Error('El nombre del producto no puede exceder 100 caracteres');
      }
    }

    if (data.price !== undefined) {
      if (data.price < 0) {
        throw new Error('El precio no puede ser negativo');
      }
    }

    if (data.stock !== undefined) {
      if (data.stock < 0) {
        throw new Error('El stock no puede ser negativo');
      }
    }

    if (data.peso !== undefined) {
      if (data.peso < 0) {
        throw new Error('El peso no puede ser negativo');
      }
    }

    if (data.categories !== undefined) {
      if (!Array.isArray(data.categories)) {
        throw new Error('Las categorías deben ser un array');
      }
    }

    if (data.images !== undefined) {
      if (!Array.isArray(data.images)) {
        throw new Error('Las imágenes deben ser un array');
      }
    }
  }

  // ===== MÉTODOS ESTADÍSTICOS =====

  getProductStatistics(): {
    totalProducts: number;
    averagePrice: number;
    totalStock: number;
    lowStockCount: number;
    averageWeight: number;
  } {
    const totalStock = this.products.reduce((sum, p) => sum + p.stock, 0);
    const totalPrice = this.products.reduce((sum, p) => sum + p.price, 0);
    const totalWeight = this.products.reduce((sum, p) => sum + p.peso, 0);
    const averagePrice = this.products.length > 0 ? totalPrice / this.products.length : 0;
    const averageWeight = this.products.length > 0 ? totalWeight / this.products.length : 0;
    const lowStockCount = this.getLowStockProducts().length;

    return {
      totalProducts: this.products.length,
      averagePrice: Number(averagePrice.toFixed(2)),
      totalStock,
      lowStockCount,
      averageWeight: Number(averageWeight.toFixed(2))
    };
  }

  // ===== MÉTODOS DE BÚSQUEDA AVANZADA =====

  searchProducts(query: string): Product[] {
    const queryLower = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(queryLower) ||
      product.description?.toLowerCase().includes(queryLower)
    );
  }

  filterProducts(filters: {
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number;
    inStock?: boolean;
    maxWeight?: number;
  }): Product[] {
    let filtered = [...this.products];

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.categoryId !== undefined) {
      filtered = filtered.filter(p => p.categories.includes(filters.categoryId!));
    }

    if (filters.inStock !== undefined && filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    if (filters.maxWeight !== undefined) {
      filtered = filtered.filter(p => p.peso <= filters.maxWeight!);
    }

    return filtered;
  }
}