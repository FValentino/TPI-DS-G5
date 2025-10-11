// src/entities/Category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Product } from "./Product.entity";

// Importar las interfaces necesarias
import { IProduct } from "./Product.entity";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    name!: string;

    @ManyToMany(() => Product, (product: Product) => product.categories)
    products!: Product[];
}

// TypeScript Interfaces
export interface ICategory {
    id: number;
    name: string;
    products?: IProduct[];
}

export interface ICreateCategory {
    name: string;
}