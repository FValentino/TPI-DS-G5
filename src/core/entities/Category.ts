// src/core/entities/Category.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Product } from "./Product.js";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number; 

  @Column({ type: 'varchar', length: 100 })
  nombre!: string; 

  @Column({ type: 'text', nullable: true })
  descripcion?: string; 

  @ManyToMany(() => Product, (product) => product.categorias)
  products!: Product[]; 
}