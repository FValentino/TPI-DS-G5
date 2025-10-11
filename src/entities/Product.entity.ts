// src/entities/Product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Category } from "./Category.entity";
import { ReservationItem } from "./ReservationItem.entity";

// Importar las interfaces necesarias
import { ICategory } from "./Category.entity";
import { IReservationItem } from "./ReservationItem.entity";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({ name: 'available_stock', type: 'int', default: 0 })
    availableStock!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @ManyToMany(() => Category, (category:Category) => category.products)
    @JoinTable({
        name: 'product_category',
        joinColumn: { 
            name: 'product_id', 
            referencedColumnName: 'id' 
        },
        inverseJoinColumn: { 
            name: 'category_id', 
            referencedColumnName: 'id' 
        }
    })
    categories!: Category[];

    @OneToMany(() => ReservationItem, (reservationItem:ReservationItem) => reservationItem.product)
    reservationItems!: ReservationItem[];
}

// TypeScript Interfaces
export interface IProduct {
    id: number;
    name: string;
    description?: string;
    price: number;
    availableStock: number;
    createdAt: Date;
    categories: ICategory[];
    reservationItems?: IReservationItem[];
}

export interface ICreateProduct {
    name: string;
    description?: string;
    price: number;
    availableStock?: number;
    categoryIds: number[];
}

export interface IUpdateProduct {
    name?: string;
    description?: string;
    price?: number;
    availableStock?: number;
    categoryIds?: number[];
}